import {Session} from "../session/schema";
import {Utils} from "../../shared/stuff/utils";
import {Survey, ComponentIf, FnIf, WorkflowElement} from "./schema";
import {MetricService} from "../metric/delegator";
import {SurveyPage} from "../../pages/survey/survey.page";
import {isNullOrUndefined} from "util";

/** Annotation to register the component */
export function RegisterComponent(constructor: Function) {
  SurveyNavigator.registerComponent(constructor.name, constructor);
}

/** Annotation to register the function. This will fail if the 'function' class does not have a zero argument constructor. */
export function RegisterFunction(constructor: Function) {
  SurveyNavigator.registerFn(constructor.name, Object.create(constructor.prototype));
}

export interface ISurveyFunction {
  canExecute(surveyNavigator: SurveyNavigator, params?: {}): boolean;
  execute(surveyNavigator: SurveyNavigator, params?: {}): string|number;
}

export interface NavigationTarget {
  component: SurveyPage;
  params:{};
}

export class SurveyNavigator {

  static componentMap: Map<string, Function> = new Map<string, Function>();
  static fnMap: Map<string, ISurveyFunction> = new Map<string, ISurveyFunction>();
  static expressionMap: Map<string, Function> = new Map<string, Function>();

  static TERMINAL = -1;

  /* Points to the the next 'step' in workflow to be executed/navigated. */
  private progCounter : number = 0;

  /**
   * Points to the result of the previous component or function operation. For functions, this variable is automatically
   * updated by this class. For components, the implementor has to update this value before calling the
   * getNavigationTarget method to get the next component to navigate to and/or process any intermediate functions. If
   * present, the last result will be passed into the next component navigated to.
   */
  private lastResult : any;

  private idToProgCounter: Map<string, number> = new Map<string, number>();

  get previousResult(): any {
    return this.lastResult;
  }

  set result(result: any) {
    this.lastResult = result;
  }

  constructor(public session: Session, public survey: Survey, public metricSvc: MetricService) {
    Utils.assertTrue(session.properties.surveyId == survey.id);
    this.idToProgCounter = this.createIdToProgCounter(this.survey.workflow);
  }

  /**
   * Called by UI components that are initializing or picking up the survey workflow.
   * If there is a valid next step(s), execute them until a SurveyComponent is encountered; then return that.
   * @returns {any} null return indicates completion of workflow
   */
  getNavigationTarget() : NavigationTarget {
    if (isNullOrUndefined(this.progCounter) || this.progCounter == SurveyNavigator.TERMINAL || !this.hasMoreSteps()) {
      return null;
    }

    let currentStep = this.survey.workflow[this.progCounter];
    this.incrementOrTerminateProgramCounter(currentStep);
    if (currentStep['fn']) {
      this.processFunction(<FnIf>currentStep);
    }
    // Default assumption is currentStep.component != null
    if (currentStep['component']) {
      // Check if component is able to run. If not, move PC and doNext. If yes, return.
      let componentStep = <ComponentIf>currentStep;
      if (this.shouldExecute(componentStep)) {
        return this.convertStepToNavigationTarget(componentStep);
      }
    }
    return this.getNavigationTarget();
  }

  private createIdToProgCounter(workflow: WorkflowElement[]): Map<string, number> {
    let ret: Map<string, number> = new Map<string, number>();
    workflow.forEach((element: WorkflowElement, index: number)=> {
      ret.set(element.id, index);
    });
    return ret;
  }

  private shouldExecute(step: ComponentIf): boolean {
    if (!step.executeIf) {
      return true;
    }
    const func = SurveyNavigator.getFunctionForExpression(step.executeIf);
    return func(this.session);
  }

  /**
   * Executes a function step
   * @param step The function definition
   * @returns {any} Next program counter 'goto' mandated by the result, or null otherwise.
   */
  private processFunction(step: FnIf): void {
    Utils.assertFalse(step.isTerminal && step.navigateOnResult);
    let fn: ISurveyFunction = SurveyNavigator.fnMap.get(step.fn);
    let jump: string = null;
    if (fn.canExecute(this, step.params)) {
      this.lastResult = fn.execute(this, step.params);
      if (step.navigateOnResult) {
        jump = step.navigateOnResult[this.lastResult.toString()];
      }
    }
    if (jump){
      this.progCounter = this.idToProgCounter.get(jump);
    }
  }

  /** Unless the step is a terminal step, increments the program counter. */
  private incrementOrTerminateProgramCounter(step: WorkflowElement) : void {
    if (step.isTerminal) {
      this.progCounter = SurveyNavigator.TERMINAL;
    } else {
      this.progCounter++;
    }
  }

  private convertStepToNavigationTarget(step: ComponentIf) : any {
    let component = SurveyNavigator.componentMap.get(step.component);
    Utils.throwIfNull(component,
      "Did not find registered component. Please check your suvey workflow at step: {0}", Utils.stringify(step));

    return {
      component: component,
      params: step.params
    }
  }

  private hasMoreSteps() {
    if (this.progCounter > this.survey.workflow.length - 1 || this.progCounter < 0) {
      return false;
    }
    return true;
  }

  static registerComponent(name: string, component: Function) {
    let map: Map<string, any> = SurveyNavigator.componentMap;
    SurveyNavigator.registerInMap(name, component, map);
  }

  static registerFn(name: string, fn: ISurveyFunction) {
    let map: Map<string, any> = SurveyNavigator.fnMap;
    SurveyNavigator.registerInMap(name, fn, map);
  }

  static registerInMap(name: string, component: any, map: Map<string, any>) {
    Utils.log("Registering: {0}, constructor: {1}, currentMap: {2}", name, component.constructor.name,
      Utils.stringify(map.entries()));
    if (map.has(name)) {
      Utils.error("Two components with same name registered");
    }
    Utils.assert(component);
    map.set(name, component);
  }

  private static getFunctionForExpression(expression: string) {
    const cleanExpression = expression.trim();
    let func = SurveyNavigator.expressionMap.get(cleanExpression);
    if (!func) {
      func = new Function('session', 'return \`' + cleanExpression + "\`");
      SurveyNavigator.expressionMap.set(cleanExpression, func);
    }
    return func;
  }
}
