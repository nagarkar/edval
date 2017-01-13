import {Pipe, PipeTransform} from "@angular/core";
import {Staff} from "../services/staff/schema";
import {Metric} from "../services/metric/schema";
import {Session} from "../services/session/schema";
import {Account} from "../services/account/schema";
import {AccountService} from "../services/account/delegator";
import {Config} from "../shared/config";
import {StaffService} from "../services/staff/delegator";

declare function compile(src);

export interface SReplacerDataMap {
  session?: Session;
  staff?: Staff;
  role?: string;
  metric?: Metric;
  account?: Account;
  accountSvc?: AccountService;
  staffSvc?: StaffService;
}

@Pipe({name: 'sReplacer'})
export class SReplacer implements PipeTransform {

  static expressionMap: Map<string, Function> = new Map<string, Function>();

  static EMPTY_STRING_FUNCTION = function() {
    return '';
  }

  dataPack: SReplacerDataMap;

  constructor(private accountSvc: AccountService, private staffSvc?: StaffService) {
    this.dataPack = {
      account: accountSvc.getCached(Config.CUSTOMERID),
      accountSvc: accountSvc,
      staffSvc: staffSvc,
    }
  }

  transform(expression: string, dataMap?: SReplacerDataMap ): string {
    let func: Function = SReplacer.getFunctionForExpression(expression);
    let localDataMap: SReplacerDataMap = {
      account: this.dataPack.account,
      accountSvc: this.dataPack.accountSvc,
      staffSvc: (dataMap && dataMap.staffSvc)? dataMap.staffSvc : this.dataPack.staffSvc,
      session: dataMap? dataMap.session : null,
      role: dataMap? dataMap.role: null,
      metric: dataMap? dataMap.metric: null,
      staff: dataMap? dataMap.staff: null
    }
    return func(localDataMap);
  }

  private static getFunctionForExpression(expression: string): Function {
    if (expression == null) {
      return SReplacer.EMPTY_STRING_FUNCTION;
    }
    const cleanExpression = expression.trim();
    let func = SReplacer.expressionMap.get(cleanExpression);
    if (!func) {
      func = this.compileX(cleanExpression);
      SReplacer.expressionMap.set(cleanExpression, func);
    }
    return func;
  }

  private static compileX(expression: string) {
    let res = () => {
      return expression;
    };
    try {
      res = compile(expression);
    } catch(err) {
      console.log(err);
    }
    return res;
  }
}
