/**
 * Created by chinmay on 2/25/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Utils} from "../../shared/stuff/utils";
import {Formatters} from "./formatters";
import {MetricAndSubject} from "./metric.subject";

/**
 * Sample URLS:
 * http://localhost:8090/api/customers/OEX/chartdata?tqx=out:tsv&tq=select datemonth, avg(value)  where metricId = 'Favorability - Frontoffice' and subjecttype = 'role' and subjecttype = 'FrontOffice' group by datemonth order by datemonth limit 2500
 *
 * Labels: Don't use special characters, such as #. These cause queries to fail. Use unicode characters, for e.g.:
 * http://www.webtoolhub.com/tn561380-xhtml-characters-list.aspx
 */
export class QueryUtils {

  static PROMOTER_QUERY: string = 'select metricName, subjecttype, subjectvalue, sum(totalCount) group by metricName, subjecttype, subjectvalue';

  static CHART_DATA_REPORT: string = 'chartdata';
  static INFLUENCERS_REPORT: string = 'influencers';
  static PROMOTER_COUNTS_REPORT: string = 'promotercounts';
  static CAMPAIGN_METRICS_REPORT: string = 'campaignmetrics';

  static INSUFFICIENT_DATA_MESSAGE: string = "Insufficient Data. Once your customers start doing surveys, you will see more data here. We refresh the data daily!";

  static PROMOTER_DETRACTOR_QUERY(metricAndSubject: MetricAndSubject): Query {
    let query = `select datemonth, sum(detractorCount)/sum(totalCount), sum(promoterCount)/sum(totalCount), sum(totalCount)
      where ` + QueryUtils.pair('metricName', '=', metricAndSubject.metricName) +
      " and " + QueryUtils.pair('subjecttype', '=', metricAndSubject.subjectType) +
      " and " + QueryUtils.pair('subjectvalue', '=', metricAndSubject.subjectValue) +
      ` group by datemonth
      order by datemonth
      limit 2500
      label datemonth 'Year-Month', sum(detractorCount)/sum(totalCount) 'Percent Detractors', 
          sum(promoterCount)/sum(totalCount) 'Percent Promoters', sum(totalCount) 'Total Surveys'`;
    return {
      queryStr: query,
      reportType: QueryUtils.PROMOTER_COUNTS_REPORT
    }
  }

  /**
   * This query should be updated with filters for subjecttype and role, once the backend report returns data on roles.
   * For e.g. the following query does not work at the moment:
   * select datemonth, avg(value)  where metricId = 'Favorability - Frontoffice'
   *    and subjecttype = 'role' and subjecttype = 'FrontOffice' group by datemonth order by datemonth limit 2500
   *
   * So we have to use the less precise query:
   * select datemonth, avg(value)  where metricId = 'Favorability - Frontoffice' group by datemonth order by datemonth limit 2500
   */
  static METRIC_RATING_QUERY(bean: MetricAndSubject) : Query {
    let query = ['select datemonth, avg(value) ', ' where ',
      QueryUtils.pair('metricId', '=', bean.metricName), ' and ',
      QueryUtils.pair('subjecttype', '=', bean.subjectType), ' and ',
      QueryUtils.pair('subjectvalue', '=', bean.subjectValue),
      ' group by datemonth order by datemonth limit 2500'].join('');
    return {
      queryStr: query,
      reportType: QueryUtils.CHART_DATA_REPORT
    }
  }

  static CHILD_METRIC_QUERY(bean: MetricAndSubject): Query {
    let query = `select datemonth, avg(value)
        where ` + QueryUtils.pair('parentMetricId','=', bean.metricName) +
          " and " + QueryUtils.pair('subjecttype', '=', bean.subjectType) +
          " and " + QueryUtils.pair('subjectvalue', '=', bean.subjectValue) +
        ` group by datemonth
        pivot metricId
        order by datemonth desc`;
    return {
      queryStr: query,
      reportType: QueryUtils.CHART_DATA_REPORT
    }
  }

  static INFLUENCER_METRIC_QUERY(metricName: string, promoterOrDetractor: boolean): Query {
    return {
      queryStr: `select influencerMetric, datemonth, sum(rank)
        where metricName = '` + metricName + `' and promoterOrDetractor=` + promoterOrDetractor + `
        group by influencerMetric, datemonth
        order by sum(rank) ` + (promoterOrDetractor ? 'desc' : 'asc') + `
        limit 4`,
      reportType: QueryUtils.INFLUENCERS_REPORT
    }
  }

  static SELECT_ALL(reportType: string, queryStr?: string): Query {
    return {
      queryStr: queryStr || 'select * ', // TODO: Adjust this based on report type.
      reportType: reportType
    };
  }

  static CAMPAIGN_METRICS_QUERY(): Query {
    return {
      queryStr: `select datemonth, sum(completedSessions), sum(abandonedSessions), sum(sessionsWithTextFeedback), 
              sum(positiveReviews), sum(negativeReviews)
        group by datemonth`,
      reportType:  QueryUtils.CAMPAIGN_METRICS_REPORT
    }
  }

  static RatingVsTimeChartOptions = {
    hAxis: {
      title: 'Time'
    },
    vAxis: {
      title: 'Rating', format: '#', ticks: [0, 1, 2, 3, 4, 5]
    },
    pointSize: 30,
  }

  static combineOptions(...options: Object[]) {
    return Object.assign({}, ...options);
  }

  static pair(field, condition, value): string {
    if (Utils.isNumeric(value) || Utils.isBoolean(value)) {
      return [field, value].join(" " + condition + " ") + " ";
    } else if (Utils.isDate(value)) {
      let dateValue: Date = value;
      return ['date ', "'", Formatters.formatDate(dateValue), "'", " ", condition, " ", field].join('') + " ";
    } else {
      let cleanValue = ["'", value, "'"].join('');
      return [field, cleanValue].join(" " + condition + " ") + " ";
    }
  }
}

export interface Query {
  queryStr: string;
  reportType: string;
}
