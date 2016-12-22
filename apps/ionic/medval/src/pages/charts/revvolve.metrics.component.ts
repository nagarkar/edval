import {Component, OnInit} from '@angular/core';
declare var Highcharts: any;


@Component({
  selector: 'revvolve-trend',
  // TODO: Add back header.
  template: `
    <!--mdval-header></mdval-header-->
    <div id="container2" style="width:100%; height:100%;"></div>
  `

})
export class RevvolveMetricsComponent implements OnInit {

  constructor() {
    //this.setupTheme();
  }

  ngOnInit() {
    Highcharts.chart('container2', {
      chart: {
        type: 'column'
      },
      title: {
        useHTML: true,
        text: '<span>Revvolve Metrics<sup>TM</sup> Overview</span>'
      },
      subtitle: {
        text: 'Click to drilldown into detailed metrics'
      },
      xAxis: {
        categories: ['July', 'August', 'September', 'October', 'November']
      },
      yAxis: {
        min: 1,
        max: 11,
        title: {
          text: 'Revvolve Score'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
          }
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
          }
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}/11',
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of 11<br/>'
      },
      series: [{
        name: 'Authentic Review Score',
        data: [...this.rr(5,6)]
      } , {
        name: 'Correlation of Scores With External Sites',
        data: [...this.rr(5,6)]
      } , {
        name: 'Volume Score',
        data: [...this.rr(5,6)]
      } , {
        name: 'Website Marketing Integration',
        data: [...this.rr(5,6)]
      }, {
        name: 'MoM Review Improvement',
        data: [...this.rr(5,6)]
      }]
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

  private rr(div: number, argCount: number): number[] {
    let ret: number[] = [];
    for (let ct = 0; ct < argCount; ct++) {
      ret.push(Math.ceil((11/div)*Math.random()));
    }
    return ret;
  }
}
