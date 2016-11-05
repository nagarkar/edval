/* TODO: Consider making this a dynamic type; with a type enum identifying how to interpret properties
 like language, MAX_VALUE, MIN_VALUE etc. This makes code to identify teh type on the client side
 simpler, since JSON doesn't allow you to specify the type explicitly.
 */
import {Utils} from "../../shared/stuff/utils";
export class Type {}

export class NPSType extends Type {
  public range: number;
}

export class TextType extends Type {
  public language: string;
}

export class MetricValue {
  constructor (public metricId: string, public parentMetricId: string, public metricValue: string) { };

  toString() {
    return Utils.stringify(this);
  }
}

export interface MetricProperties  {
  metricName: string;
  definition: {
    npsType?: NPSType;
    textType?: TextType;
  }
}

export class Metric {

  private static readonly rolePattern = /^role:(.*)/i;
  private static readonly staffPattern = /^staff:(.*)/i;

  customerId: string;
  metricId     : string;
  subject   : string;
  parentMetricId: string;
  entityStatus: string;
  properties: MetricProperties;

  toString() {
    return Utils.stringify(this);
  }

  public isLow(value: MetricValue) {
    return this.isNpsType() && value && this.isDetractor(value);
  }

  /** Returns true is value is defined, a number, and greater than 8. */
  public isHigh(value: MetricValue) {
    return this.isNpsType() && value && this.isPromoter(value);
  }

  /** Returns true is value is defined, a number, and less than 2. */
  public isInMiddle(value: MetricValue) {
    return !this.isLow(value) && !this.isHigh(value);
  }

  public isTextType(): boolean {
    return this.properties.definition.textType != null;
  }

  public isNpsType() : boolean {
    return this.properties.definition.npsType != null;
  }

  private isDetractor(value: MetricValue): boolean {
    return +(value.metricValue)/this.properties.definition.npsType.range <= 0.545454545;
  }

  private isPromoter(value: MetricValue): boolean {
    return +(value.metricValue)/this.properties.definition.npsType.range >= 0.727272727;
  }

  hasRoleSubject() {
    return Metric.rolePattern.test(this.subject);
  }

  hasStaffSubject() {
    return Metric.staffPattern.test(this.subject);
  }

  getRoleSubject() {
    if(this.hasRoleSubject()){
      return Metric.rolePattern.exec(this.subject)[1];
    }
    return null;
  }

  getStaffSubject() {
    if(this.hasStaffSubject()){
      return Metric.staffPattern.exec(this.subject)[1];
    }
    return null;
  }

  setStaffSubject(username: string) {
    this.subject = "staff:" + username;
  }
}
