/* TODO: Consider making this a dynamic type; with a type enum identifying how to interpret properties
 like language, MAX_VALUE, MIN_VALUE etc. This makes code to identify teh type on the client side
 simpler, since JSON doesn't allow you to specify the type explicitly.
 */
export class Type {}

export class NPSType extends Type {
  public static MAX_VALUE : number = 11;
  public static MIN_VALUE : number = 1;
}

export class TextType extends Type {
  public language: string;
}

export class MetricValue {
  constructor (public metricId: string, public parentMetricId: string, public metricValue: string) { };

  toString() {
    return JSON.stringify(this);
  }
}

export interface MetricProperties  {
  metricName: string;
  definition: {
    npsType : any;
    textType: any;
  }
}

export class Metric {
  customerId: string;
  metricId     : string;
  subject   : string;
  parentMetricId: string;
  entityStatus: string;
  properties: MetricProperties;

  toString() {
    return JSON.stringify(this);
  }

  public isRoot() {
    return !this.parentMetricId;
  }

  public isLow(value: MetricValue) {
    return this.isNpsType() && +(value.metricValue) <= 2;
  }

  public isHigh(value: MetricValue) {
    return this.isNpsType() && +(value.metricValue) >= 8;
  }

  public isInMiddle(value: MetricValue) {
    return this.isNpsType() && +(value.metricValue) <= 4;
  }

  public isTextType(): boolean {
    return this.properties.definition.textType;
  }

  public isNpsType() : boolean {
    return this.properties.definition.npsType;
  }
}
