/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component} from "@angular/core";
import {NavController, AlertController, ToastController} from "ionic-angular";
import {AccountComponent} from "../account/account.component";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {LoginComponent} from "../login/login.component";
import {TermComponent} from "./terms/term.component";
import {PolicyComponent} from "./policy/policy.component";
import {StaffComponent} from "../staff/staff.component";
import {Utils} from "../../shared/stuff/utils";
import {SettingsComponent} from "../settings/settings.component";
import {StartWithSurveyOption} from "../survey/start/start.with.survey.option.component";
import {CampaignDashboard} from "../reporting/campaign.dashboard";
import {StaffService} from "../../services/staff/delegator";
import {Staff} from "../../services/staff/schema";
import {AccountService} from "../../services/account/delegator";
import {Account} from "../../services/account/schema";
import {Config} from "../../shared/config";
import {ValidationService} from "../../shared/components/validation/validation.service";
import {HelpMessages} from "../../shared/stuff/HelpMessages";
import {AdminComponent} from "../admin.component";
import {FollowupPage} from "../followups/followup.page";
import {Http} from "@angular/http";
import {HelpPage} from "./help/help.page";
import {Tips} from "../tips";
import {DeviceServices} from "../../shared/service/DeviceServices";

declare let AWSCognito:any;
declare let AWS:any;

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends AdminComponent {

  constructor(
    navCtrl: NavController,
    http: Http,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private accessTokenProvider: AccessTokenService,
    private staffSvc: StaffService,
    private accSvc: AccountService) {

    super(navCtrl, http);
  }

  ngOnInit() {
    super.ngOnInit();

    this.dispatchAlertTipForAccountSettings();
    this.dispatchAlertTipForStaffSettings();
  }

  verifyEmail() {
    var me = this;
    var cognitoUser = this.accessTokenProvider.cognitoUser;
    cognitoUser.getAttributeVerificationCode('email', {
      onSuccess: function (result) {
        Utils.log('Get Attribute Verification Code completed');
      },
      onFailure: function(err) {
        Utils.presentTopToast(me.toastCtrl, "Internal Error: " + err, 10*1000);
      },
      inputVerificationCode: function() {
        Utils.presentAlertPrompt(
          me.alertCtrl,
          ((data)=> {
            let verificationCode = data.verificationCode;

            cognitoUser.verifyAttribute('email', verificationCode, {
              onFailure(err) {
                Utils.presentInvalidEntryAlert(me.alertCtrl, 'Problems...', 'Could not verify your code: ' + err.message);
              },
              onSuccess() {
                Utils.presentInvalidEntryAlert(me.alertCtrl, 'Email Verified!', 'If you forget your password, you can now request a new password with your username!');
              }
            });
          }),
          "Please check your registered email address and input the verification code we just sent to you!",
          [{name: "verificationCode", label: 'Verification Code'}]);

      }
    });
  }

  gotoHelp() {
    this.push(HelpPage);
  }

  gotoHome(): void {
    this.push(LoginComponent);
  }

  gotoSettings(): void {
    this.push(SettingsComponent);
  }

  openNavAccountPage() {
    this.push(AccountComponent);
  }

  gotoStaffPage() {
    this.push(StaffComponent);
  }

  gotoMetricsPage() {
    this.push(CampaignDashboard);
  }

  gotoFollowupsPage() {
    this.push(FollowupPage);
  }

  gotoSurveyPage() {
    this.setRoot(StartWithSurveyOption);
  }

  openNavGetHelpPage() {
    this.push(LoginComponent);
  }

  openNavTermsPage() {
    this.push(TermComponent);
  }

  openNavPrivacyPage() {
    this.push(PolicyComponent);
  }

  logout(){
    this.accessTokenProvider.logout();
    this.setRoot(LoginComponent);
  }

  private push(component: any) : void {
    Utils.push(this.navCtrl, component);
  }

  private setRoot(component) {
    Utils.setRoot(this.navCtrl, component);
  }

  private dispatchAlertTipForAccountSettings() {
    let promise: Promise<any> = DeviceServices.getItem(Tips.AccountSettingsTips);
    promise.then((value)=>{
      if (!value) {
        setTimeout(()=>{
          this.accSvc.get(Config.CUSTOMERID)
            .then((account: Account)=> {
              let thingsToSay = [];
              if (!account.properties.configuration.SWEEPSTAKES_SHOW_WHEEL) {
                thingsToSay.push(`Consider enabling the Wheel of Fortune game. It's a great incentive for patients 
            to keep coming back and give you more reviews! You can set this up on the Account Settings page.`);
              }
              if (!ValidationService.urlValidator.test(account.properties.configuration.REVIEW_URL_FACEBOOK)) {
                thingsToSay.push(`Consider adding a valid Facebook page URL on the Account Settings page so we can start helping your happy patients provide Facebook reviews!`);
              }
              if (!ValidationService.urlValidator.test(account.properties.configuration.REVIEW_URL_GOOGLE)) {
                thingsToSay.push(`Consider adding a valid Google review URL on the Account Settings page so we can start helping your happy patients provide Google reviews!`);
              }
              if (!ValidationService.urlValidator.test(account.properties.configuration.REVIEW_URL_YELP)) {
                thingsToSay.push(`Consider adding a valid Yelp review URL on the Account Settings page so we can start helping your happy patients provide Yelp reviews!`);
              }
              if (thingsToSay.length == 0) {
                return;
              }
              this.presentTip(
                Tips.AccountSettingsTips,
                "Important Tip!",
                `Visit the Account Settings page and configure this App and take full advantage of it!
                    <ol>` + thingsToSay.map((item: string)=> {return ['<li>', item, '</li>'].join('')}).join("") + `</ol>`);
            })
            .catch((err)=>{
              Utils.presentTopToast(this.toastCtrl, HelpMessages.get('UNEXPECTED_INTERNAL_ERROR'), 10 * 1000);
            });

        }, 2 * 1000)
      }
    })

  }

  private dispatchAlertTipForStaffSettings() {
    let promise: Promise<any> = DeviceServices.getItem(Tips.StaffSettingsTips)
    promise.then((value)=> {
      if (!value) {
        setTimeout(()=> {
          this.staffSvc.list(true/*don't use cache*/)
            .then((list: Staff[]) => {
              if (list && list.length > 0) {
                return;
              }
              this.presentTip(Tips.StaffSettingsTips, 'Tip: Setup your Staff',
                `If you setup your staff members, additional screens will show up in the 
                long term survey and you can access reports on how your staff are evaluated in survey data! 
                We highly recommend you setup your staff members!`,
              )
            })
            .catch((err)=> {
              Utils.presentTopToast(this.toastCtrl, HelpMessages.get('UNEXPECTED_INTERNAL_ERROR'), 10 * 1000);
            })
        }, 4 * 1000);
      }
    })
  }

  private dispatchAlertTipForGettingStarted() {
    let promise: Promise<any> = DeviceServices.getItem(Tips.GettingStartedTips)
    promise.then((value)=> {
      if (!value) {
        setTimeout(()=> {
          this.presentTip(Tips.GettingStartedTips, 'Tip: Visit the Getting Started Page',
            `Visit the Getting Started Page to find out more about this app and it's capabilities!`,
          )
        }, 4 * 1000);
      }
    })
  }

  private presentTip(tipName: string, title: string, message: string) {
    this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Remind me next time'
        },
        {
          text: "Don't show me this again",
          handler: ()=>{
            DeviceServices.setItem(tipName, true)
              .catch((err)=>{
                Utils.presentTopToast(this.toastCtrl, "Could not save user setting", 1 * 1000);
              });
          }
        }
      ]
    })
  }
}

