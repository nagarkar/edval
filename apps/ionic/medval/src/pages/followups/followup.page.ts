/**
 * Created by chinmay on 3/3/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component} from "@angular/core";
import {AdminComponent} from "../admin.component";
import {NavController, AlertController, ToastController} from "ionic-angular";
import {SessionFollowupService} from "../../services/followup/delegator";
import {SessionFollowup, FollowupTaskState, TaskNames} from "../../services/followup/schema";
import {Utils} from "../../shared/stuff/utils";
import {HelpMessages} from "../../shared/stuff/HelpMessages";
import {SessionService} from "../../services/session/delegator";
import {Session} from "../../services/session/schema";
import {Http} from "@angular/http";

@Component({
  selector:'followupsByTaskName',
  templateUrl: './followup.page.html'
})
export class FollowupPage extends AdminComponent {

  section: string = 'standard';
  list: SessionFollowup[] = [];
  followupsByTaskName: Map<string, SessionFollowup[]> = new Map<string, SessionFollowup[]>();
  changes: {} = {};

  constructor(
    navCtrl: NavController,
    http: Http,
    private toastCtrl: ToastController,
    private svc: SessionFollowupService,
    private alertCtrl: AlertController,
    private sessionsvc: SessionService) {

    super(navCtrl, http);
  }

  get standardFollowups() {
    return this.followupsByTaskName.get(TaskNames.STANDARD_FOLLOWUP) || [];
  }

  get targetedFollowups() {
    return this.followupsByTaskName.get(TaskNames.TARGETED_FOLLOWUP) || [];
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

  getHelp(item: string) {
    return HelpMessages.getMessageFor(item);
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

  setComplete(fp: SessionFollowup){
    let changedFp = this.changes[fp.compositeKey];
    if (!changedFp) {
      changedFp = {}
    }
    changedFp.taskState = FollowupTaskState.COMPLETE;
    this.changes[fp.compositeKey] = changedFp;
  }

  saveChanges() {
    this.list.forEach((fp: SessionFollowup)=>{
      let key = fp.compositeKey;
      let changedFp = this.changes[key];
      if (!changedFp) {
        return;
      }
      Object.assign(fp, changedFp);
      this.svc.update(fp);
    });
  }
}
