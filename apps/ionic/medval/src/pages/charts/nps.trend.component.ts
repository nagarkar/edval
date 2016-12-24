import {Component, OnInit} from "@angular/core";
declare var Highcharts: any;


@Component({
  selector: 'nps-trend',
  // TODO: Add back header.
  template: `
    <!--mdval-header></mdval-header-->
    <div id="container" style="min-width: 310px; height: 100%; margin: 0 auto"></div>
  `

})
export class NpsTrendComponent implements OnInit {

  constructor() {
    //this.setupTheme();
  }

  ngOnInit() {
    Highcharts.chart('container', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'General Surgeon metrics'
      },
      subtitle: {
        text: 'Click to drilldown into detailed metrics'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Score'
        }
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}/11'
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of 11<br/>'
      },
      series: [{
        name: 'Net Promoter Score Q1',
        data: [
          {name:"Dr Adel El-Ghazzawy", y:this.r(), drilldown: "adelg-q1-nps"},
          {name:"Dr Chow", y:this.r(), drilldown: "chow-q1-nps"},
          {name:"Dr Cho", y:this.r(), drilldown: "cho-q1-nps"}]
      },{
        name: 'Net Promoter Score Q2',
        data: [
          {name:"Dr Adel El-Ghazzawy", y:this.r(), drilldown: "adelg-q2-nps"},
          {name:"Dr Chow", y:this.r(), drilldown: "chow-q2-nps"},
          {name:"Dr Cho", y:this.r(), drilldown: "cho-q2-nps"}]
      }],
      drilldown: {
        series: [{
          name: 'Dr El-Ghazzawy Q1 Detailed Metrics',
          id: 'adelg-q1-nps',
          data: [
            ['Bedside Manner', this.r()],
            ['Provided Clear Treatment Plan', this.r()],
            ['Knowledgeable', this.r()],
            ['Great Followup on Treatment Plan', this.r()]
          ]
        }, {
          name: 'Dr Chow Q1 Detailed Metrics',
          id: 'chow-q1-nps',
          data: [
            ['Bedside Manner', this.r()],
            ['Provided Clear Treatment Plan', this.r()],
            ['Knowledgeable', this.r()],
            ['Great Followup on Treatment Plan', this.r()]
          ]
        }, {
          name: 'Dr Cho Q1 Detailed Metrics',
          id: 'cho-q1-nps',
          data: [
            ['Bedside Manner', this.r()],
            ['Provided Clear Treatment Plan', this.r()],
            ['Knowledgeable', this.r()],
            ['Great Followup on Treatment Plan', this.r()]
          ]
        }, {
          name: 'Dr El-Ghazzawy Q1 Detailed Metrics',
          id: 'adelg-q2-nps',
          data: [
            ['Bedside Manner', this.r()],
            ['Provided Clear Treatment Plan', this.r()],
            ['Knowledgeable', this.r()],
            ['Great Followup on Treatment Plan', this.r()]          ]
        }, {
          name: 'Dr Chow Q1 Detailed Metrics',
          id: 'chow-q2-nps',
          data: [
            ['Bedside Manner', this.r()],
            ['Provided Clear Treatment Plan', this.r()],
            ['Knowledgeable', this.r()],
            ['Great Followup on Treatment Plan', this.r()]          ]
        }, {
          name: 'Dr Cho Q1 Detailed Metrics',
          id: 'cho-q2-nps',
          data: [
            ['Bedside Manner', this.r()],
            ['Provided Clear Treatment Plan', this.r()],
            ['Knowledgeable', this.r()],
            ['Great Followup on Treatment Plan', this.r()]          ]
        }]
      }
    });
  }

  /*

  setupTheme() {
    // Canned Themes available here: https://github.com/highcharts/highcharts/tree/master/js/themes
    Highcharts.theme = {
      colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
        '#FF9655', '#FFF263', '#6AF9C4'],
      chart: {
        backgroundColor: {
          linearGradient: [0, 0, 500, 500],
          stops: [
            [0, 'rgb(255, 255, 255)'],
            [1, 'rgb(240, 240, 255)']
          ]
        },
      },
      title: {
        style: {
          color: '#000',
          font: 'bold 2em "Trebuchet MS", Verdana, sans-serif'
        }
      },
      subtitle: {
        style: {
          color: '#666666',
          font: 'bold 1em "Trebuchet MS", Verdana, sans-serif'
        }
      },

      legend: {
        itemStyle: {
          font: '1em Trebuchet MS, Verdana, sans-serif',
          color: 'black'
        },
        itemHoverStyle: {
          color: 'gray'
        }
      }
    };
    Highcharts.setOptions(Highcharts.theme);
  }
  */

  private r() {
    return Math.ceil(11*Math.random());
  }
}
