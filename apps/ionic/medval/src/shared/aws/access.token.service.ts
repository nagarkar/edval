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
import {AlertController} from "ionic-angular";
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

  private _cognitoUser : any = null;
  private loginErrors: number = -1;
  private _username : string = null;
  private authenticationDetails: any = null;
  private userPool: any = null;

  // Visible for Testing
  static authResult: AuthResult = null;

  private static authenticatingIntervalTimer : number;

  constructor(private alertCtrl: AlertController, private serviceFactory: ServiceFactory) {}

  public getUserName() : string {
    return this._username;
  }

  public logout() : void {
    AwsClient.flushLogs();
    AwsClient.clearEverything();
    this.clearLoginSignals();
  }

  public supposedToBeLoggedIn(): boolean {
    return this._cognitoUser !== null && !this.authTokenIsOld();
  }

  public startNewSession(
    username : string,
    password : string,
    callback: (result: AuthResult, err: any)=> void) {

    if (this.loginErrors >= 0) {
      return; // we're still in the process of trying to log in.
    }
    this.tryStartNewSession(username, password, callback);
  }

  private tryStartNewSession(
    username : string,
    password : string,
    callback: (result: AuthResult, err: any)=> void,
    loginErrors?: number) {

    this.loginErrors = loginErrors || 0;
    Utils.log("Trying to log in {0} ", username);
    this._username = username;
    var authenticationData: {Username: string, Password: string} = {
      Username : username,
      Password : password,
    };

    if (this.sameUserAuthenticatingWithinShortPeriod(authenticationData) && !this.authTokenIsOld()) {
      this.processUserInitiatedLoginSuccess(callback);
      return;
    }

    this.authenticationDetails =
      new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    this.userPool =
      new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(Config.POOL_DATA);

    const userData = {
      Username : username,
      Pool : this.userPool
    };

    this._cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    this.startAuthenticatingUser((result?: AuthResult, err?: any)=>{
      if (err) {
        this.loginErrors++;
      }
      if (err && this.loginErrors > 1) {
        this.resetLoginErrors();
        callback(null, err);
      } else if (result) {
        this.resetLoginErrors();
        callback(result, null);
      } else {
        setTimeout(()=>{
          this.tryStartNewSession(username, password, callback, this.loginErrors);
        }, 3 * 1000);
      }
    });
    this.refreshAtIntervals();
  }

   get cognitoUser(): any {
    return this._cognitoUser;
  }

  private refreshAtIntervals(_refreshErrors?: number): void {
    this.clearAuthenticatingIntervalTimerIfValid();
    let refreshErrors = _refreshErrors || 0;
    AccessTokenService.authenticatingIntervalTimer = setInterval(()=> {
      this._cognitoUser.getSession((err?: any, session?: any)=>{

        // TESTING
        err = true;
        // END TEsTING

        if (err) {
          refreshErrors++;
        }
        if (err && refreshErrors > 2) {
          Utils.error("Cleared Login Signals from refreshAtIntervals");
          this.clearLoginSignals();
          this.clearAuthenticatingIntervalTimerIfValid();
        } else if (session) {
          this.createNewAuthToken(session)
        } else {
          this.refreshAtIntervals(refreshErrors);
        }
      });
    }, Config.ACCESS_TOKEN_REFRESH_TIME);
  }

  private startAuthenticatingUser(callback): void {
    var me = this;
    Utils.log("Starting Authentication");
    //AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'})
    this._cognitoUser.authenticateUser(this.authenticationDetails, {
      onSuccess: (session) => {
        Utils.log("AccessTokenSvc.onSuccess");
        this.createNewAuthToken(session);

        Utils.log("After aws.config.update");

        let gotCustomerId = false;
        me._cognitoUser.getUserAttributes((err, result) => {
          if (err) {
            Utils.log(Utils.format("Error while trying to get cognito user attributes for user {0} , error: {1}",
              me._username, err));
          }
          if (result) {
            for (let i = 0; i < result.length; i++) {
              if (result[i].getName() == "custom:organizationName") {
                Config.CUSTOMERID = result[i].getValue();
                if (Config.CUSTOMERID) {
                  gotCustomerId = true;
                }
                Utils.log('Got userattrbute customerid {0}', Config.CUSTOMERID);
                me.processUserInitiatedLoginSuccess(callback);
              }
            }
            Utils.errorIf(!gotCustomerId, "No customer id found in account attributes");
          }
        });
      },
      onFailure: (err) => {
        callback(null, err);
      },
      newPasswordRequired: function(userAttributes, requiredAttributes) {
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.
        Utils.presentAlertPrompt(
          me.alertCtrl,
          (data) => {
            me._cognitoUser.completeNewPasswordChallenge(data.password, {"email": data.email}, this);
          },
          "Please choose a new password",
          [
            {
              name: 'password',
              placeholder: 'New Password:'
            },
            {
              name: 'email',
              placeholder: 'Your Email Address:'
            }
          ]);
      },
      mfaRequired: function(codeDeliveryDetails) {
        // MFA is required to complete user authentication.
        // Get the code from user and call
        alert('mfa required');
      }
    });
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
      && this.lastAuthTokenCreationTime + 70 * 60 * 10000 > Date.now();
  }

  processUserInitiatedLoginSuccess(callback) {
    this.lastAuthTokenCreationTime = Date.now();
    callback(AccessTokenService.authResult);
    AwsClient.reInitialize();
    this.serviceFactory.resetRegisteredServices();
    Utils.log("Completed processUserInitiatedLoginSuccess at time: {0}", this.lastAuthTokenCreationTime);
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

    this.lastAuthTokenCreationTime = Date.now();

    AccessTokenService.authResult = new AuthResult(
      session.getAccessToken().getJwtToken(),
      session.getIdToken().getJwtToken());

    // See https://goo.gl/xJsiHp for detailed discussion of how to get credentials.
    AWS.config.update({
      credentials : new AWS.CognitoIdentityCredentials({
        IdentityPoolId: Config.AWS_CONFIG.IDENTITY_POOL_ID,
        Logins: {
          'cognito-idp.us-east-1.amazonaws.com/us-east-1_WRjTRJPkD': session.getIdToken().getJwtToken()
        }
      }),
      region: Config.AWS_CONFIG.REGION
    });
  }

  private clearLoginSignals() {
    this._cognitoUser = null;
    Config.CUSTOMERID = null;
    AccessTokenService.authResult = null;
    this.resetLoginErrors();
    this.clearAuthenticatingIntervalTimerIfValid();
  }

  private resetLoginErrors() {
    this.loginErrors = -1;
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
