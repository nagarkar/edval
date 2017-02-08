/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Pipe, PipeTransform, Injectable} from "@angular/core";
import {Staff} from "../services/staff/schema";
import {Metric} from "../services/metric/schema";
import {Session} from "../services/session/schema";
import {Account} from "../services/account/schema";
import {AccountService} from "../services/account/delegator";
import {Config} from "../shared/config";
import {StaffService} from "../services/staff/delegator";
import {SessionService} from "../services/session/delegator";

declare function compile(src);

export interface SReplacerDataMap {
  session?: Session;
  // List of staff in current context. For some pages, staff may be selected prior in the session. Or a page for a staff-specific metric.
  staff?: Staff[];
  // Current role. For instance, you can havea  page that has metrics for a specific role.
  role?: string;
  onlyStaff?: Staff;
  metric?: Metric;
  account?: Account;
  accountSvc?: AccountService;
  staffSvc?: StaffService;
}

@Pipe({name: 'sReplacer'})
@Injectable()
export class SReplacer implements PipeTransform {

  static expressionMap: Map<string, Function> = new Map<string, Function>();

  static EMPTY_STRING_FUNCTION = function() {
    return '';
  }

  dataPack: SReplacerDataMap;

  constructor(private accountSvc: AccountService, private staffSvc: StaffService, private sessionSvc: SessionService) {
    this.dataPack = {
      account: accountSvc.getCached(Config.CUSTOMERID),
      accountSvc: accountSvc,
      staffSvc: staffSvc,
    }
  }

  transform(expression: string, dataMap?: SReplacerDataMap, fresh?: boolean ): string {
    let func: Function = this.getFunctionForExpression(expression, fresh);
    let localDataMap: SReplacerDataMap = {};
    localDataMap.account    = this.dataPack.account;
    localDataMap.accountSvc = this.dataPack.accountSvc;
    localDataMap.staffSvc   = (dataMap && dataMap.staffSvc)? dataMap.staffSvc : this.dataPack.staffSvc;
    localDataMap.session    = (this.sessionSvc.hasCurrentSession() ? this.sessionSvc.getCurrentSession(): undefined);
    localDataMap.metric     = dataMap? dataMap.metric: null;
    localDataMap.role       = this.decideRole(dataMap);
    localDataMap.staff      = this.decideStaffFor(dataMap);
    localDataMap.onlyStaff  = this.decideOnlyStaff(localDataMap);
    return func(localDataMap);
  }

  private getFunctionForExpression(expression: string, fresh: boolean): Function {
    if (expression == null) {
      return SReplacer.EMPTY_STRING_FUNCTION;
    }
    const cleanExpression = expression.trim();
    if (fresh) {
      return this.compileX(cleanExpression);
    }
    let func = SReplacer.expressionMap.get(cleanExpression);
    if (!func) {
      func = this.compileX(cleanExpression);
      SReplacer.expressionMap.set(cleanExpression, func);
    }
    return func;
  }

  private compileX(expression: string) {
    let res = () => {
      return expression;
    };
    try {
      res = compile(expression);
    } catch(err) {
    }
    return res;
  }

  private decideStaffFor(dataMap: SReplacerDataMap): Staff[] {
    if (dataMap && dataMap.staff) {
      if(Array.isArray(dataMap.staff) && dataMap.staff.length > 0){
        return dataMap.staff;
      } else if (dataMap.staff.constructor.name == 'Staff') {
        return [Object.assign(new Staff(), dataMap.staff)];
      }
    }
    if (this.sessionSvc.hasCurrentSession()) {
      let names: string[] = this.sessionSvc.getCurrentSession().properties.selectedStaffUserNames;
      if (Array.isArray(names) && names.length > 0) {
        let staffList: Staff[] = this.staffSvc.listCached().filter((staff: Staff) => {
          return names.indexOf(staff.username) >= 0;
        })
        let roles: string[] = this.accountSvc.getCached(Config.CUSTOMERID).getStandardRoles();
        roles.forEach((role: string) =>{
          let onlyStaff: Staff = this.staffSvc.getOnly(role);
          if (onlyStaff && staffList.indexOf(onlyStaff) < 0) {
            staffList.push(onlyStaff);
          }
        });
        return staffList;
      }
    } else if (dataMap && dataMap.role) {
      return this.staffSvc.listCached().filter((staff: Staff)=>{
        return staff.role == dataMap.role;
      });
    }
    return null;
  }

  private decideOnlyStaff(localDataMap: SReplacerDataMap) {
    let metric: Metric = localDataMap.metric;
    let staffs: Staff[] = localDataMap.staff;
    if (!staffs) {
      return null;
    }
    let role = localDataMap.role;
    if (role) {
      staffs = staffs.filter((staff: Staff)=>{
        return staff.role == role;
      });
      if (staffs.length == 1) {
        return staffs[0];
      }
    } else if (staffs.length == 1) {
      return staffs[0];
    }
    return null;
  }

  private decideRole(dataMap: SReplacerDataMap): string {
    if (!dataMap) {
      return null;
    }
    if (dataMap.role) {
      return dataMap.role;
    }
    if (dataMap.metric && dataMap.metric.hasRoleSubject()) {
      return dataMap.metric.getRoleSubject();
    }
    return null;
  }
}
