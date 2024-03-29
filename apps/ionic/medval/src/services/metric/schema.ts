/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Utils} from "../../shared/stuff/utils";
import {Type as tType} from "class-transformer";
import {Config} from "../../shared/config";

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

export class MetricProperties  {
  metricName?: string;
  metricDescription?: string;
  conversationSetup?:string;
  question?: string;
  positiveImpact?: string;
  improvement?:string;
  @tType(() => MetricDefinition)
  definition: MetricDefinition = new MetricDefinition();
}

export class MetricDefinition {
  @tType(() => NPSType)
  npsType?: NPSType;
  @tType(() => TextType)
  textType?: TextType;

  setType(type) {
    if (type instanceof NPSType) {
      this.npsType = type;
      this.textType = undefined;
    } else if (type instanceof TextType) {
      this.textType = type;
      this.npsType = undefined;
    }
  }
}

export class Metric {

  static readonly ROLE_SUBJECT_TYPE = "role";
  static readonly ORG_SUBJECT_TYPE = "org";
  static readonly STAFF_SUBJECT_TYPE = "staff";

  // Test regex changes here: https://regex101.com/
  private static readonly rolePattern = /^role:(.*)/i;
  private static readonly staffPattern = /^staff:(.*)/i;
  private static readonly orgPattern = /(^org$)|(^org:(.+)$)/i;

  customerId: string;
  metricId     : string;
  subject   : string;
  parentMetricId: string;
  entityStatus: string;
  softwareVersion: string = Config.SOFTWARE_VERSION;

  @tType(() => MetricProperties)
  properties: MetricProperties = new MetricProperties();


  constructor(type?: NPSType | TextType, id?:string, subject?:string) {
    if (!id) {
      id = Utils.guid("m" /* prefix */);
    }
    this.metricId = id;
    this.subject = subject;
    this.properties.definition.setType(type);
    this.softwareVersion = Config.SOFTWARE_VERSION;
  }

  toString() {
    return Utils.stringify(this);
  }

  isRoot() {
    return this.parentMetricId == null;
  }

  isLow(value: MetricValue) {
    return this.isNpsType() && value && this.isDetractor(+value.metricValue);
  }

  /** Returns true is value is defined, a number, and greater than 8. */
  isHigh(value: MetricValue) {
    return this.isNpsType() && value && this.isPromoter(+value.metricValue);
  }

  /** Returns true is value is defined, a number, and less than 2. */
  isInMiddle(value: MetricValue) {
    return !this.isLow(value) && !this.isHigh(value);
  }

  isTextType(): boolean {
    return this.properties.definition.textType != null;
  }

  isNpsType() : boolean {
    return this.properties.definition.npsType != null;
  }

  isDetractor(value: number): boolean {
    return value/this.properties.definition.npsType.range < 0.72727272;
  }

  isStrongDetractor(value: number): boolean {
    return value/this.properties.definition.npsType.range < 0.72727272;
  }

  isPromoter(value: number): boolean {
    return Metric.isPromoterRatio(value/this.properties.definition.npsType.range);
  }

  hasRoleSubject(): boolean {
    return Metric.rolePattern.test(this.subject);
  }

  hasStaffSubject() {
    return Metric.staffPattern.test(this.subject);
  }

  getRoleSubject() {
    if(this.hasRoleSubject()){
      return Metric.GetRoleInSubject(this.subject);
    }
    return null;
  }

  getStaffSubject() {
    if(this.hasStaffSubject()){
      return Metric.GetUserNameInSubject(this.subject);
    }
    return null;
  }

  setStaffSubject(username: string) {
    this.subject = "staff:" + username;
  }

  static GetRoleInSubject(subject: string) {
    return Metric.rolePattern.exec(subject)[1];
  }

  static GetUserNameInSubject(subject: string) {
    return Metric.staffPattern.exec(subject)[1];
  }

  static isPromoterRatio(value: number): boolean {
    return value > 0.81818181;
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

  static createStaffSubject(staffName: string) {
    return "staff:" + staffName;
  }

  static createRoleSubject(role: string) {
    return "role:" + role;
  }
}
