import {Utils} from "../../shared/stuff/utils";

export class Survey {

  constructor () { }

  customerId: string;
  id: string;
  entityStatus?:string;
  properties?: {
    name?: string;
    purpose?: string;
    timeCommitment: string;
  }
  workflow: ComponentIf[] |FnIf[];

  toString() {
    return Utils.stringify(this);
  }

  get displayName(): string {
    return [this.properties.name, "(", this.properties.purpose, ")"].join(' ');
  }
}

export interface ComponentIf {
  component:string,
  params?: {
    metricId?: string,
    staffId?: string,
    roles?: Array<string>,
    sampleSize?: number,
    metrics?: Array<string>
  },
  navigateOnException?: number,
  isTerminal?: boolean
};

export interface FnIf {
  fn:string,
  params?: {
    metricId?: string,
    staffId?: string,
    roles?: Array<string>,
    sampleSize?: number,
    metrics?: Array<string>
  },
  navigateOnResult?: {
    [res: string]: number;
  },
  isTerminal?: boolean
};
