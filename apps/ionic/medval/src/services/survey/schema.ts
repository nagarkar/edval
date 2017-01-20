import {Utils} from "../../shared/stuff/utils";

export class Survey {

  constructor () {
    this.workflowProperties = {avgSteps: 4};
    this.properties = {};
  }

  customerId: string;
  id: string;
  entityStatus?:string;
  properties?: {
    name?: string;
    purpose?: string;
    timeCommitment?: string;
  };
  workflowProperties: WorkflowProperties;

  workflow: WorkflowElement[];

  toString() {
    return Utils.stringify(this);
  }

  get displayName(): string {
    return [this.properties.name, "(", this.properties.purpose, ")"].join(' ');
  }
}

export interface WorkflowProperties {
  avgSteps: number;
  showJokes?: boolean;
  showWheel?: boolean;
  award?: number;
  costPerUse?: number;
}

export interface WorkflowElement {
  id: string,
  params?: {
    metricId?: string,
    staffId?: string,
    roles?: Array<string>,
    sampleSize?: number,
    metrics?: Array<string>
  },
  isTerminal?: boolean
}

export interface ComponentIf extends WorkflowElement {
  component:string,
  executeIf?: string,
  navigateOnException?: number,
};

export interface FnIf extends WorkflowElement{
  fn:string,
  navigateOnResult?: {
    [res: string]: string;
  },
};
