/**
 * Created by chinmay on 3/4/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Pipe, Injectable, PipeTransform} from "@angular/core";
import {Utils} from "../shared/stuff/utils";
import {DatePipe} from "@angular/common";
import {Config} from "../shared/config";

@Pipe({name: 'rDate'})
@Injectable()
export class RevvolveDatePipe implements PipeTransform {

  datePipe: DatePipe = new DatePipe(Config.LOCALE);

  transform(expression: string): string {
    if (!Utils.isNumeric(expression)) {
      return expression;
    }
    let dt = new Date(Number.parseInt(expression));
    return this.datePipe.transform(expression, 'shortDate') + " - " + this.getHourString(dt.getHours());
  }

  getHourString(hours: number): string {
    if (hours == 0) {
      return 12 + " AM hour";
    }
    if (hours == 12) {
      return 12 + " PM hour";
    }
    if (hours > 12) {
      return (hours - 12) + " PM hour";
    }
    return hours + " AM hour";
  }
}
