export interface Metric {
  customerId: string;
  metricId     : string;
  entityStatus: string;
  subject   : string;
  properties: {
    metricName: string;
    definition: {
      type : NPSType | TextType;
    }
  }
}

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
  constructor (public metricId: string, public metricValue: string) { };
}
