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

  private _cognitoUser : any;
  private loginErrors: number;
  private _username : string = null;
  private authenticationDetails: any = null;
  private userPool: any = null;

  // Visible for Testing
  static authResult: AuthResult = null;

  private static authenticatingIntervalTimer : number;

  constructor(private alertCtrl: AlertController, private serviceFactory: ServiceFactory) {
    this.initState();
  }

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
    externalCallback: (result: AuthResult, err: any)=> void) {

    if(this.currentlyLoggingIn()) {
      return;
    }
    this.tryStartNewSession(username, password, externalCallback);
  }

  private tryStartNewSession(
    username : string,
    password : string,
    externalCallback: (result: AuthResult, err: any)=> void,
    loginErrors?: number) {

    this.loginErrors = loginErrors || 0;
    Utils.log("Trying to log in {0} ", username);
    this._username = username;
    var authenticationData: {Username: string, Password: string} = {
      Username : username,
      Password : password,
    };

    if (this.sameUserAuthenticatingWithinShortPeriod(authenticationData) && !this.authTokenIsOld()) {
      this.processUserInitiatedLoginSuccess(externalCallback);
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
        externalCallback(null, err);
      } else if (result) {
        this.resetLoginErrors();
        externalCallback(result, null);
      } else {
        setTimeout(()=>{
          this.tryStartNewSession(username, password, externalCallback, this.loginErrors);
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
      if (this.currentlyLoggingIn()) {
        return;
      }
      this._cognitoUser.getSession((err?: any, session?: any)=>{
        if (err) {
          refreshErrors++;
        }
        if (err && refreshErrors > 2) {
          Utils.error("Clearing Login Signals from refreshAtIntervals: {0}", err);
          this.clearLoginSignals();
          this.clearAuthenticatingIntervalTimerIfValid();
        } else if (session) {
          this.createNewAuthToken(session)
        } else {
          setTimeout(()=>{
            this.refreshAtIntervals(refreshErrors);
          }, Config.ACCESS_TOKEN_REFRESH_TIME/3);
        }
      });
    }, );
  }

  private startAuthenticatingUser(internalCallback): void {
    var me = this;
    Utils.log("Starting Authentication");
    //AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'})
    this._cognitoUser.authenticateUser(this.authenticationDetails, {
      onSuccess: (session) => {
        this.handleSuccessfullAuthentication(session, internalCallback);
      },
      onFailure: (err) => {
        internalCallback(null, err);
      },
      newPasswordRequired: function(userAttributes, requiredAttributes) {
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.
        Utils.presentAlertPrompt(
          me.alertCtrl,
          (data) => {
            me._cognitoUser.completeNewPasswordChallenge(data.password, {"email": data.email}, {
              onSuccess: function(session) {
                me.handleSuccessfullAuthentication(session, internalCallback);
              },
              onFailure: function(error) {
                internalCallback(null, error);
              }
            });
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
    this.initState();
    Config.CUSTOMERID = null;
  }

  public resetLoginErrors() {
    this.loginErrors = -1;
  }

  private currentlyLoggingIn() {
    return this.loginErrors >= 0;
  }

  private initState() {
    this.resetLoginErrors();
    this._cognitoUser = null;
    this.lastAuthTokenCreationTime = Infinity;
    AccessTokenService.authResult = null;
    this.clearAuthenticatingIntervalTimerIfValid();
  }

  private handleSuccessfullAuthentication(session: any, callback) {
    Utils.log("AccessTokenSvc.onSuccess");
    this.createNewAuthToken(session);

    Utils.log("After aws.config.update");

    let gotCustomerId = false;
    this._cognitoUser.getUserAttributes((err, result) => {
      if (err) {
        Utils.log(Utils.format("Error while trying to get cognito user attributes for user {0} , error: {1}",
          this._username, err));
        this.clearLoginSignals();
      }
      if (result) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].getName() == "custom:organizationName") {
            Config.CUSTOMERID = result[i].getValue();
            if (Config.CUSTOMERID) {
              gotCustomerId = true;
            }
            Utils.log('Got userattrbute customerid {0}', Config.CUSTOMERID);
            this.processUserInitiatedLoginSuccess(callback);
          }
        }
        if (!gotCustomerId) {
          Utils.errorIf(!gotCustomerId, "No customer id found in account attributes");
          this.clearLoginSignals();
        }

      }
    });

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
