/**
 * Created by chinmay on 3/3/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component} from "@angular/core";
import {AdminComponent} from "../admin.component";
import {NavController, AlertController, ToastController, Toggle} from "ionic-angular";
import {SessionFollowupService} from "../../services/followup/delegator";
import {SessionFollowup, FollowupTaskState, TaskNames} from "../../services/followup/schema";
import {Utils} from "../../shared/stuff/utils";
import {SessionService} from "../../services/session/delegator";
import {Session} from "../../services/session/schema";
import {Http} from "@angular/http";

@Component({
  selector:'followupsByTaskName',
  templateUrl: './followup.page.html'
})
export class FollowupPage extends AdminComponent {

  section: string = 'automatic';
  list: SessionFollowup[] = [];
  followupsByTaskName: Map<string, SessionFollowup[]> = new Map<string, SessionFollowup[]>();

  constructor(
    navCtrl: NavController,
    http: Http,
    private toastCtrl: ToastController,
    private svc: SessionFollowupService,
    alertCtrl: AlertController,
    private sessionsvc: SessionService) {

    super(navCtrl, alertCtrl, http);
  }

  get pendingStandardFollowups() {
    return this.standardFollowups.filter((followup: SessionFollowup)=>{
      return followup.taskState == FollowupTaskState.NOT_INITIATED;
    })
  }

  get standardFollowups() {
    return this.followupsByTaskName.get(TaskNames.STANDARD_FOLLOWUP) || [];
  }

  get pendingTargetedFollowups() {
    return this.targetedFollowups.filter((followup: SessionFollowup)=>{
      return followup.taskState == FollowupTaskState.NOT_INITIATED;
    })
  }

  get targetedFollowups() {
    return this.followupsByTaskName.get(TaskNames.TARGETED_FOLLOWUP) || [];
  }

  get pendingAutomaticFollowups() {
    return this.automaticFollowups.filter((followup: SessionFollowup)=>{
      return followup.taskState == FollowupTaskState.NOT_INITIATED;
    })
  }

  get automaticFollowups() {
    let result = (this.followupsByTaskName.get(TaskNames.EMAIL_REVIEW_REMINDER) || []).concat(
      ...(this.followupsByTaskName.get(TaskNames.SMS_REVIEW_REMINDER) || [])
    );
    return result;
  }

  ngOnInit() {
    super.ngOnInit();
    this.svc.list(true)
      .then((list: SessionFollowup[])=> {
        this.list = list.sort((a: SessionFollowup, b: SessionFollowup)=>{
          let aSessionId: number = Number.parseInt(a.sessionId);
          let bSessionId: number = Number.parseInt(b.sessionId);
          return aSessionId - bSessionId;
        });
        this.list.forEach((fp: SessionFollowup)=>{
          let fps: SessionFollowup[];
          fps = this.followupsByTaskName.get(fp.taskName);
          if (fps == null) {
            fps = [];
          }
          fps.push(fp);
          this.followupsByTaskName.set(fp.taskName, fps);
        });
      });
  }

  showHelp(item: string) {
    Utils.showHelp(this.alertCtrl, item, 'bighelp');
  }

  isComplete(fp: SessionFollowup): boolean {
    return fp.taskState == FollowupTaskState.COMPLETE;
  }

  showContactInfo(fp: SessionFollowup, complaint: boolean) {
    this.sessionsvc.get(fp.sessionId, false)
      .then((session: Session)=>{
        let props = session.properties;
        let email = complaint ? props.complaintData.email : props.reviewData.email;
        let phone = complaint ? props.complaintData.phone : props.reviewData.phone;
        let msg = (phone ? "Phone: " + phone : "") + " \n" + (email ? "Email: " + email : "");
        Utils.presentInvalidEntryAlert(this.alertCtrl, "Contact Information", msg);
      })
      .catch((err)=>{
        let msg = ['Error when trying to get contact info.', ' Are you sure you are connected to the internet?'].join('');
        Utils.presentTopToast(this.toastCtrl, msg, 10 * 1000);
      })
  }

  isInitiated(fp: SessionFollowup): boolean {
    return fp.taskState == FollowupTaskState.INITIATED || this.isComplete(fp);
  }

  setComplete(fp: SessionFollowup, event: Toggle){
    fp['touched'] = !fp['touched'];
    if (event.checked) {
      fp.taskState = FollowupTaskState.COMPLETE;
    } else {
      fp.taskState = FollowupTaskState.NOT_INITIATED;
    }
  }

  saveChanges(taskName: string) {
    let arr: SessionFollowup[] = this.followupsByTaskName.get(taskName);
    if (!arr) {
      return;
    }
    arr.forEach((fp: SessionFollowup)=>{
      if (fp['touched']) {
        delete fp['touched'];
        this.svc.update(fp)
          .then(()=>{
            Utils.presentTopToast(this.toastCtrl, "Saved Changes", 4 * 1000);
          });
      }
    });
  }
}
