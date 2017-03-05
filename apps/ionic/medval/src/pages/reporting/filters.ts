/**
 * Created by chinmay on 2/11/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
declare let google;

export class Filters {

  static MONTH_NAMES = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

  static createDateFilter(){
    return new google.visualization.ControlWrapper({
      'controlType': 'DateRangeFilter',
      'containerId': 'dateRangeFilterDiv',
      'options':{
        'filterColumnLabel': 'Date'
      }
    });
  }

  static createRoleFilter() {
      return new google.visualization.ControlWrapper({
        'controlType': 'StringFilter',
        'containerId': 'roleFilterDiv',
        'options':{
          'filterColumnLabel': 'Role',
          'ui': {
            'caption': 'Choose a Role',
            'allowNone': false,
          }
        }
      });
    }

  static createStaffFilter() {
    return new google.visualization.ControlWrapper({
      'controlType': 'StringFilter',
      'containerId': 'staffFilterDiv',
      'options':{
        'filterColumnLabel': 'Staff Member',
        'ui': {
          'caption': 'Choose a Staff Member',
          'allowNone': false,
        }
      }
    });
  }

  static createMetricFilter() {
    return new google.visualization.ControlWrapper({
      'controlType': 'StringFilter',
      'containerId': 'metricFilterDiv',
      'options': {
        'filterColumnLabel': 'Metric',
        'ui': {
          'caption': 'Choose a Metric',
          'allowNone': false,
        }
      }
    });
  }

  static createMonthYearFilter(divId: HTMLDivElement, filterColumnIndex?: number) {
    return new google.visualization.ControlWrapper({
      controlType: 'DateRangeFilter',
      containerId: divId,
      options: {
        filterColumnIndex: filterColumnIndex || 0,
        ui: {
          labelStacking: 'vertical',
          format: {pattern: 'yyyy-MMMM'}
        }
      }
    });
  }

  static createCategoryFilter(values: string[], divId, selectedValue?: string) {
    return new google.visualization.ControlWrapper({
      controlType: 'CategoryFilter',
      containerId: divId,
      state: {
        selectedValues: selectedValue || [values[0]]
      },
      options: {
        filterColumnIndex: 1,
        ui: {
          labelStacking: 'vertical'
        },
        values: values,
        allowNone: false,
        allowMultiple: false,
      }
    });
  }

  static getColumnGeneratorWithDateAsFirstMonthAndRemainingColumns() {
    return (table): Array<any> => {
      let numColumns = table.getNumberOfColumns();
      let columns = [];
      for (let idx = 0; idx < numColumns; idx++) {
        columns[idx] = idx;
      }
      columns[0] = {
        calc: (datatable, rowIndex) => {
          let dt = datatable.getValue(rowIndex, 0);
          return [Filters.MONTH_NAMES[dt.getMonth()], (dt.getYear() + 1900)].join('-');
        },
        type: 'string',
      };
      return columns;
    }
  }

  static getColumnGeneratorWithDateAsFirstMonthAndRemainingColumnsWithPercentage(indexes: number[]) {
    return (table): Array<any> => {
      let numColumns = table.getNumberOfColumns();
      let columns = [];
      for (let idx = 1; idx < numColumns; idx++) {
        if (indexes[idx]) {
          columns[idx] = {
            calc: (datatable, rowIndex) => {
              let value = datatable.getValue(rowIndex, idx);
              return Math.floor(value * 100) + '%';
            },
            type: 'number'
          };
        } else {
          columns[idx] = idx;
        }
      }
      columns[0] = {
        calc: (datatable, rowIndex) => {
          let dt = datatable.getValue(rowIndex, 0);
          return [Filters.MONTH_NAMES[dt.getMonth()], (dt.getYear() + 1900)].join('-');
        },
        type: 'string',
      };
      return columns;
    }
  }
}
