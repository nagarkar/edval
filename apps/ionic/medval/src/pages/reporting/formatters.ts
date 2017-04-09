/**
 * Created by chinmay on 2/11/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
export class Formatters {

  static floorDateToDay(datetime): Date {
    var newDate = new Date(datetime);
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    return newDate;
  }

  static floorDateToMonth(datetime): Date {
    var newDate = new Date(datetime);
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setDate(1);
    return newDate;
  }

  static formatDate(date): string {
    var monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return [year, monthNames[monthIndex], day].join("-");
  }

  static standardOptions = {
    hAxis: {
      title: 'Time', format:'MMM, y'
    },
    vAxis: {title: 'Rating (1 to 5)', format: '#', ticks:[1, 2, 3, 4, 5]},
    trendlines: {
      0: { type: 'linear', color: 'green', lineWidth: 3, opacity: 0.3, showR2: true, visibleInLegend: true}
    },
    pointSize: 20,
  }

  static getChartOptionsGeneratorFromDefaults(combineOptions: {}): (table) => {} {
    return (table) => {
      return Object.assign({}, combineOptions);
    }
  }
}
