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

export interface NavigatorState {
  progCounter?: number;
  scratchPad?: any;
  lastResult?: any;
  stepsTaken: number;
}
export class SurveyNavigator {

  static componentMap: Map<string, Function> = new Map<string, Function>();
  static fnMap: Map<string, ISurveyFunction> = new Map<string, ISurveyFunction>();
  static expressionMap: Map<string, Function> = new Map<string, Function>();

  static TERMINAL = -1;

  scratchPad: any = {}

  /* Points to the the previous 'step' in workflow to be executed/navigated. */
  set navState(state: NavigatorState) {
    Utils.throwIfNNOU(state.progCounter);
    this.progCounter = state.progCounter;
    this.scratchPad = state.scratchPad;
    this.lastResult = state.lastResult;
    this.stepsTaken = state.stepsTaken;
  }

  get navState(): NavigatorState {
    let navState: NavigatorState = {stepsTaken: this.stepsTaken};
    try {
      if (this.progCounter !== undefined) {
        navState.progCounter = this.progCounter;
      }
      if (navState.scratchPad !== undefined) {
        navState.scratchPad = JSON.parse(JSON.stringify(this.scratchPad));
      }
      if (navState.lastResult !== undefined) {
        navState.lastResult = JSON.parse(JSON.stringify(this.lastResult));
      }
    } catch(err) {
      Utils.error("FATAL ERROR IN SURVEYNAVIGATOR get navState(): " + err);
    } finally {
      return navState;
    }
  }

  /* Points to the the next 'step' in workflow to be executed/navigated. */
  private progCounter : number = 0;

  /**
   * Points to the result of the previous component or function operation. For functions, this variable is automatically
   * updated by this class. For components, the implementor has to update this value before calling the
   * getNavigationTarget method to get the next component to navigate to and/or process any intermediate functions. If
   * present, the last result will be passed into the next component navigated to.
   */
  private lastResult : any;

  // Zero based index of many steps have been completed in this workflow.
  // This should be incremented to 0 when the program counter is first incremented
  // (i.e. the first workflow screen is displayed)
  private stepsTaken = -1;

  private idToProgCounter: Map<string, number> = new Map<string, number>();

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
    let currentProgCounter = this.progCounter;
    try {
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
          this.incrementStepsTaken();
          return this.convertStepToNavigationTarget(componentStep);
        }
      }
      let navTarget: NavigationTarget = this.getNavigationTarget();
      return navTarget;
    } catch(err) {
      Utils.error("FATAL ERROR IN SURVEYNAVIGATOR:" + err);
    }
  }

  getProgressFraction() {
    if (this.stepsTaken == 0) {
      return 0.1;
    }
    let result = this.stepsTaken/this.survey.workflowProperties.avgSteps;
    let step = this.survey.workflow[this.progCounter];
    if (result < .6 && (!step || step.isTerminal)) {
      return 0.9;
    }
    if (result < 0) {
      return 0;
    } else if (result >= 1) {
      return 0.9
    }

    return result;
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
      this.setProgramCounter(this.idToProgCounter.get(jump));
    }
  }

  /** Unless the step is a terminal step, increments the program counter. */
  private incrementOrTerminateProgramCounter(step: WorkflowElement) : void {
    if (step.isTerminal) {
      this.setProgramCounter(SurveyNavigator.TERMINAL);
    } else {
      this.incrementProgramCounter();
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
    return this.progCounter <= this.survey.workflow.length - 1 && this.progCounter >= 0;
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

  private setProgramCounter(newProgramCounter: number) {
    this.progCounter = newProgramCounter;
  }

  private incrementStepsTaken() {
    this.stepsTaken++;
  }

  private incrementProgramCounter() {
    this.setProgramCounter(this.progCounter + 1);
  }
}
