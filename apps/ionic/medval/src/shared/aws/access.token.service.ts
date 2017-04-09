/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Utils} from "../stuff/utils";
import {Config} from "../config";
import {ServiceFactory} from "../../services/service.factory";
import {AwsClient} from "./aws.client";
import {AlertController, ToastController} from "ionic-angular";
import {SpinnerDialog} from "ionic-native";
import {AccountService} from "../../services/account/delegator";
declare let AWSCognito:any;
declare let AWS:any;

/**
 * For additional implementation details:
 * <link>http://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html</link>
 * and <link>https://github.com/awslabs/aws-cognito-angular2-quickstart/blob/master/src/app/service/cognito.service.ts</link>
 * and <link>https://github.com/aws/amazon-cognito-identity-js/blob/master/src/CognitoUser.js</link>
 */
@Injectable()
export class AccessTokenService {

  private lastAuthTokenCreationTime: number = Infinity;

  private _cognitoUser : any;
  // Tracks state of login. If defined, login process has started. After login process starts, this variable indicates
  // the number of login errors.
  private loginInProgress: boolean;
  private _username : string = null;
  private authenticationDetails: any = null;
  private userPool: any = null;

  // Visible for Testing
  static authResult: AuthResult = null;

  private static authenticatingIntervalTimer : number;

  constructor(private alertCtrl: AlertController, private toast: ToastController, private serviceFactory: ServiceFactory, private accSvc: AccountService) {
    this.clearLoginSignals();
  }

  public getUserName() : string {
    return this._username;
  }

  public logout() : void {
    AwsClient.flushLogs();
    AwsClient.clearEverything();
    this.clearLoginSignals(true /* Don't clear last login state (time, username/pwd) so we can avoid long logins*/);
  }

  public supposedToBeLoggedIn(): boolean {
    return this._cognitoUser !== null && !this.authTokenIsOld();
  }

  // externalCallback: (result: AuthResult, err: any)=> void
  public login(username : string, password : string): Promise<Account> {
    if (this.loginInProgress) {
      return;
    }
    this.loginInProgress = true;
    return this.tryStartNewSession(username, password)
      .then((result: Account)=> {
        this.loginInProgress = false;
        return result;
      })
      .catch((err)=> {
        this.loginInProgress = false
        throw err;
      })
  }

  get cognitoUser(): any {
    return this._cognitoUser;
  }

  private tryStartNewSession(username : string, password : string): Promise<Account> {
    Utils.log("Trying to log in {0} ", username);
    this._username = username;
    var authenticationData: {Username: string, Password: string} = {
      Username : username,
      Password : password,
    };
    username = username.toLowerCase().trim();

    if (this.sameUserAuthenticatingWithinShortPeriod(authenticationData) && !this.authTokenIsOld()) {
      Utils.info("Logging in same user");
      return this.processUserInitiatedLoginSuccess();
    }

    this.authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    this.userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(Config.POOL_DATA);

    const userData = { Username : username, Pool : this.userPool };

    this._cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);


    return this.startAuthenticatingUser();
  }

  private refreshAtIntervals(_refreshErrors?: number): void {
    this.clearAuthenticatingIntervalTimerIfValid();
    let refreshErrors = _refreshErrors || 0;
    AccessTokenService.authenticatingIntervalTimer = setInterval(()=> {
      this._cognitoUser.getSession((err?: any, session?: any)=>{
        if (err) {
          refreshErrors++;
          Utils.info("Refresh Login Failure {0}, # of errors so far: {1}", err, refreshErrors);
        }
        if (err && refreshErrors > Config.MAX_TOKEN_REFRESH_ERRORS_BEFORE_STOP) {
          Utils.error("Clearing Login Signals from refreshAtIntervals: {0}", err);
          this.clearLoginSignals();
          this.clearAuthenticatingIntervalTimerIfValid();
        } else if (session) {
          Utils.info("Refreshed Token");
          refreshErrors = 0;
          this.createNewAuthToken(session)
        }
      });
    }, Config.ACCESS_TOKEN_REFRESH_TIME);
  }

  private startAuthenticatingUser(): Promise<Account> {
    var me = this;
    return new Promise<Account>((resolve, reject)=>{
      Utils.info("Starting Authentication");
      //AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'})
      this._cognitoUser.authenticateUser(this.authenticationDetails, {
        onSuccess: (session) => {
          resolve(me.getUserAttributesAndCustomerId(session));
        },
        onFailure: (err) => {
          reject(err);
        },
        newPasswordRequired: function(userAttributes, requiredAttributes) {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.
          SpinnerDialog.hide();
          Utils.presentAlertPrompt(
            me.alertCtrl,
            (data) => {
              Utils.showSpinner();
              me._cognitoUser.completeNewPasswordChallenge(data.password, {}, {
                onSuccess: function(session) {
                  Utils.hideSpinner();
                  resolve(me.getUserAttributesAndCustomerId(session));
                },
                onFailure: function(error) {
                  Utils.hideSpinner();
                  reject(error);
                }
              });
            },
            "Choose a new password",
            [
              {
                name: 'password',
                type: 'password',
                placeholder: 'New Password'
              },
            ],
            null, /* Message */
            (data: any)=>{
              Utils.hideSpinner();
            });
        },
        mfaRequired: function(codeDeliveryDetails) {
          // MFA is required to complete user authentication.
          // Get the code from user and call
          alert('mfa required');
        }
      });
    })
  }

  private clearAuthenticatingIntervalTimerIfValid() {
    if (AccessTokenService.authenticatingIntervalTimer) {
      clearInterval(AccessTokenService.authenticatingIntervalTimer);
    }
  }

  private sameUserAuthenticatingWithinShortPeriod(authenticationData: {Username: string; Password: string}) {
    return this.authenticationDetails
      && this.authenticationDetails['username'] == authenticationData.Username
      && this.authenticationDetails['password'] == authenticationData.Password
      && this.loggedInAtLeastOnceBefore()
      && this.lastAuthTokenCreationTime + Config.ACCESS_TOKEN_REFRESH_TIME > Date.now();
  }

  private processUserInitiatedLoginSuccess(): Promise<Account> {
    this.lastAuthTokenCreationTime = Date.now();
    return this.serviceFactory.resetRegisteredServices()
      .then(()=> {
        return this.accSvc.get(Config.CUSTOMERID)
          .then((account)=>{
            Config.CUSTOMER = account;
            AwsClient.reInitialize();
            this.refreshAtIntervals();
            Utils.info("Completed processUserInitiatedLoginSuccess at time: {0}", this.lastAuthTokenCreationTime);
            return account;
          })
          .catch((err)=>{
            Utils.error("Error getting account from processUserInitiatedLoginSuccess, Error: {0}", err);
            throw err;
          });
      })
      .catch((err)=>{
        Utils.error("Error getting account from processUserInitiatedLoginSuccess, error: {0}", err);
        //Utils.presentTopToast(this.toast, err);
        throw err;
      });
  }

  private authTokenIsOld(): boolean {
    let now = Date.now();
    let authTokenAge = now - this.lastAuthTokenCreationTime;
    return authTokenAge > 30 * 60 * 1000;
  }

  private loggedInAtLeastOnceBefore() {
    return this.lastAuthTokenCreationTime != Infinity;
  }

  private createNewAuthToken(session: any) {
    try {
      this.lastAuthTokenCreationTime = Date.now();

      AccessTokenService.authResult = new AuthResult(
        session.getAccessToken().getJwtToken(),
        session.getIdToken().getJwtToken());

      // See https://goo.gl/xJsiHp for detailed discussion of how to get credentials.
      AWS.config.update({
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: Config.AWS_CONFIG.IDENTITY_POOL_ID,
          Logins: {
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_WRjTRJPkD': session.getIdToken().getJwtToken()
          }
        }),
        region: Config.AWS_CONFIG.REGION
      });
    } catch(err) {
      Utils.error("Error Occurred while creating new Auth Token: {0}", err);
      throw err;
    }
  }

  private clearLoginSignals(dontResetLastLoginState?: boolean) {
    this.clearAuthenticatingIntervalTimerIfValid();

    if (!dontResetLastLoginState) {
      this.initLastLoginState();
    }
  }

  private initLastLoginState() {
    Config.CUSTOMERID = null;
    this._cognitoUser = null;
    AccessTokenService.authResult = null;
    this.lastAuthTokenCreationTime = Infinity;
    this.authenticationDetails = null;
  }

  private getUserAttributesAndCustomerId(session: any): Promise<Account> {
    Utils.info("AccessTokenSvc.onSuccess");
    return new Promise<Account>((resolve, reject)=>{
      this.createNewAuthToken(session);

      Utils.info("After aws.config.update");

      Config.CUSTOMERID = undefined;
      this._cognitoUser.getUserAttributes((err, result) => {
        if (err) {
          Utils.error(Utils.format("Error while trying to get cognito user attributes for user {0} , error: {1}",
            this._username, err));
          this.clearLoginSignals();
          reject(err);
        }
        if (result) {
          for (let i = 0; i < result.length; i++) {
            if (result[i].getName() != "custom:organizationName") {
              continue;
            }
            Utils.info('Got userattrbute customerid {0}', result[i].getValue());
            if (result[i].getValue()) {
              Config.CUSTOMERID = result[i].getValue();
              resolve(this.processUserInitiatedLoginSuccess());
              break;
            }
          }
          if (!Config.CUSTOMERID) {
            reject("No customer id found in account attributes");
            this.clearLoginSignals();
          }
        }
      });
    })
  }
}

export class AuthResult {
  accessToken : string;
  idToken : string;
  constructor(accessToken: string, idToken: string) {
    this.accessToken = accessToken;
    this.idToken = idToken;
  }
}
