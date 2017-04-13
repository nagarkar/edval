/**
 * Created by chinmay on 4/12/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {AnyComponent} from "./any.component";
import {Subject} from "rxjs";
import {RevvolveApp} from "../app/revvolve.app";
import {AccessTokenService} from "../shared/aws/access.token.service";
import {Idle, DEFAULT_INTERRUPTSOURCES} from "@ng-idle/core";
import {Utils} from "../shared/stuff/utils";
import {Config} from "../shared/config";
import {StartWithSurveyOption} from "./survey/start/start.with.survey.option.component";
import {NavController} from "ionic-angular";


export abstract class RevvolvePage extends AnyComponent {

  static GOING_TO_ROOT_TEST: boolean = false;
  static timeoutSubscription: Subject<number>;
  static Idler?: Idle;

  constructor(protected navCtrl: NavController) {
    super();
    if (!RevvolvePage.Idler) {
      RevvolvePage.Idler = RevvolveApp.GlobalInjector.get(Idle);
    }
  }

  ngOnInit() {
    if (!AccessTokenService.authResult) {
      RevvolvePage.stopIdling();
      this.actionOnTimeout();
      return;
    }
    this.startIdling();
  }

  protected idleSeconds(): number {
    return undefined;
  }

  protected timeoutSeconds(): number {
    return undefined;
  }

  protected actionOnTimeout() {
    if (RevvolvePage.GOING_TO_ROOT_TEST == true) {
      return;
    }
    RevvolvePage.GOING_TO_ROOT_TEST = true;
    Utils.setRoot(this.navCtrl, StartWithSurveyOption, {defaultSurveyOnly: true}).then(()=> {
      RevvolvePage.GOING_TO_ROOT_TEST = false;
    }).catch((err)=> {
      RevvolvePage.GOING_TO_ROOT_TEST = false;
      Utils.error(err)
    });
  }

  private static EndSubscription() {
    if (RevvolvePage.timeoutSubscription) {
      RevvolvePage.timeoutSubscription.unsubscribe();
    }
  }

  static stopIdling() {
    RevvolvePage.EndSubscription(); // Kill previous subscriptions.
    if (!RevvolvePage.Idler) {
      return;
    }
    RevvolvePage.Idler.stop();
    RevvolvePage.Idler.clearInterrupts();
  }

  // THis method is not static because it uses subclass overrides for idleSeconds() and timeoutSeconds().
  protected startIdling(idleSeconds?: number, timeoutSeconds?: number) {
    RevvolvePage.stopIdling();
    let idler = RevvolvePage.Idler;
    if (!idler) {
      return;
    }
    idler.setIdle(idleSeconds || this.idleSeconds() || Config.PAGE_IDLE_SECONDS);
    idler.setTimeout(timeoutSeconds || this.timeoutSeconds() || Config.PAGE_TIMEOUT_SECONDS);
    idler.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    idler.watch();

    RevvolvePage.timeoutSubscription = idler.onTimeout.subscribe(() => {
      try {
        RevvolvePage.stopIdling();
      } catch (err) {
        return;
      }
      this.actionOnTimeout();

    })
  }
}
