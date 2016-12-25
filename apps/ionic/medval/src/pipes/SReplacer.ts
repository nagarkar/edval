import { Pipe, PipeTransform } from '@angular/core';
import {Staff} from "../services/staff/schema";
import {Metric} from "../services/metric/schema";
import {Session} from "../services/session/schema";
import {Role, Account} from "../services/account/schema";
import {AccountService} from "../services/account/delegator";
import {Config} from "../shared/aws/config";

declare function compile(src);

export interface SReplacerDataMap {
  session?: Session;
  staff?: Staff;
  role?: Role;
  metric?: Metric;
  account: Account;
}

@Pipe({name: 'sReplacer'})
export class SReplacer implements PipeTransform {

  static expressionMap: Map<string, Function> = new Map<string, Function>();

  dataPack: SReplacerDataMap;

  constructor(private accountSvc: AccountService) {
    this.dataPack = {
      account: accountSvc.getCached(Config.CUSTOMERID)
    }
  }

  transform(expression: string, dataMap?: SReplacerDataMap ): string {
    let func: Function = SReplacer.getFunctionForExpression(expression);
    let localDataMap: SReplacerDataMap = {
      account: this.dataPack.account,
      session: dataMap? dataMap.session : null,
      role: dataMap? dataMap.role: null,
      metric: dataMap? dataMap.metric: null,
      staff: dataMap? dataMap.staff: null
    }
    return func(localDataMap);
  }

  private static getFunctionForExpression(expression: string): Function {
    const cleanExpression = expression.trim();
    let func = SReplacer.expressionMap.get(cleanExpression);
    if (!func) {
      func = this.compileX(cleanExpression);
      SReplacer.expressionMap.set(cleanExpression, func);
    }
    return func;
  }

  private static compileX(expression: string) {
    return compile(expression);
  }
}
