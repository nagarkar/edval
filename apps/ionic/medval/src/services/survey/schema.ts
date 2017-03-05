/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/config";

export class Survey {

  constructor () {
    this.softwareVersion = Config.SOFTWARE_VERSION;
    this.workflowProperties = {avgSteps: 4};
    this.properties = {};
  }

  customerId: string;
  id: string;
  entityStatus?:string;
  softwareVersion: string = Config.SOFTWARE_VERSION;
  properties?: {
    name?: string;
    purpose?: string;
    description?: string;
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
  avgSteps: number; // Average steps in the workflow.
  showJokes?: boolean; // Whether or not to show jokes.
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
