/* TODO: Consider making this a dynamic type; with a type enum identifying how to interpret properties
 like language, MAX_VALUE, MIN_VALUE etc. This makes code to identify teh type on the client side
 simpler, since JSON doesn't allow you to specify the type explicitly.
 */
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/aws/config";
export class Type {}

export class NPSType extends Type {
  public range: number;
}

export class TextType extends Type {
  public language: string;
}

export class MetricValue {
  constructor (public metricId: string, public metricValue: string) { };

  toString() {
    return Utils.stringify(this);
  }
}

export interface MetricProperties  {
  metricName: string;
  metricDescription?: string;
  question?: string;
  definition: {
    npsType?: NPSType;
    textType?: TextType;
  }
}

export class Metric {

  private static readonly rolePattern = /^role:(.*)/i;
  private static readonly staffPattern = /^staff:(.*)/i;
  private static readonly orgPattern = /(^org$)|(^org:(.+)$)/i;

  customerId: string;
  metricId     : string;
  subject   : string;
  parentMetricId: string;
  entityStatus: string;
  properties: MetricProperties;


  constructor(type?: NPSType | TextType, id?:string, subject?:string) {
    if (!id) {
      id = Utils.guid("m" /* prefix */);
    }
    // TODO: The following line can be safely removed from here since server will populate customerid if it's in url path.
    this.customerId = Config.CUSTOMERID;
    this.metricId = id;
    this.subject = subject;
    this.properties = {
      metricName:'',
      definition: {
        npsType: type instanceof NPSType ? type : null,
        textType: type instanceof TextType ? type : null
      }
    };
  }

  toString() {
    return Utils.stringify(this);
  }

  public isRoot() {
    return this.parentMetricId == null;
  }

  public isLow(value: MetricValue) {
    return this.isNpsType() && value && this.isDetractor(+value.metricValue);
  }

  /** Returns true is value is defined, a number, and greater than 8. */
  public isHigh(value: MetricValue) {
    return this.isNpsType() && value && this.isPromoter(+value.metricValue);
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

  public isDetractor(value: number): boolean {
    return value/this.properties.definition.npsType.range < 0.72727272;
  }

  public isStrongDetractor(value: number): boolean {
    return value/this.properties.definition.npsType.range < 0.72727272;
  }

  public isPromoter(value: number): boolean {
    return value/this.properties.definition.npsType.range > 0.81818181;
  }

  hasRoleSubject(): boolean {
    return Metric.rolePattern.test(this.subject);
  }

  static isRoleSubject(subject: string): boolean {
    return Metric.rolePattern.test(subject);
  }

  static isStaffSubject(subject: string): boolean {
    return Metric.staffPattern.test(subject);
  }

  static isOrgSubject(subject: string): boolean {
    return Metric.orgPattern.test(subject);
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

  static createRoleSubject(role: string) {
    return "role:" + role;
  }
}
