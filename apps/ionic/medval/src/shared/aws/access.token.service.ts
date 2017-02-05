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
 */
@Injectable()
export class AccessTokenService {

  private lastAuthTokenCreationTime: number = -Infinity;

  private _cognitoUser : any = null;
  private _username : string = null;
  private authenticationDetails: any = null;
  private userPool: any = null;

  // Visible for Testing
  static authResult: AuthResult = null;

  private callback: (result?: AuthResult, err?: any) => void;

  private static authenticatingIntervalTimer : number;

  constructor(private alertCtrl: AlertController, private serviceFactory: ServiceFactory) {}

  public getUserName() : string {
    return this._username;
  }

  public logout() : void {
    AwsClient.flushLogs();
    this._cognitoUser = null;
    this.clearAuthenticatingIntervalTimerIfValid();
    Config.CUSTOMERID = null;
    AwsClient.clearEverything();
  }

  public supposedToBeLoggedIn(): boolean {
    return this._cognitoUser !== null && !this.authTokenIsOld();
  }

  public startNewSession(
    username : string,
    password : string,
    fn: (result: AuthResult, err: any)=> void) {
    this.callback = fn;
    this._username = username;
    var authenticationData: {Username: string, Password: string} = {
      Username : username,
      Password : password,
    };

    if (this.sameUserAuthenticatingWithinShortPeriod(authenticationData) && !this.authTokenIsOld()) {
      this.processUserInitiatedLoginSuccess();
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
    this.startAuthenticatingUser(true);
    this.startAuthenticatingUserAtIntervals();
  }

   get cognitoUser(): any {
    return this._cognitoUser;
  }


  private startAuthenticatingUserAtIntervals(): void {
    this.clearAuthenticatingIntervalTimerIfValid();
    AccessTokenService.authenticatingIntervalTimer = setInterval(()=> {
      this.startAuthenticatingUser(false);
    }, Config.REFRESH_ACCESS_TOKEN)
  }

  /**
   let error: string = null;

   * @returns {Promise<T>|Promise}
   */

  private startAuthenticatingUser(initializeAttributes: boolean): void {
    var me = this;
    this._cognitoUser.authenticateUser(this.authenticationDetails, {
      onSuccess: (session) => {
        Utils.log("AccessTokenSvc.onSuccess");
        me.authenticationDetails['lastLoggedInTime'] = Date.now();
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
        Utils.log("After aws.config.update");

        if (!initializeAttributes) {
          return;
        }

        me._cognitoUser.getUserAttributes((err, result) => {
          if (err) {
            Utils.log(Utils.format("Error while trying to get cognito user attributes for user {0} , error: {1}",
              me._username, err));
          }
          if (result) {
            for (let i = 0; i < result.length; i++) {
              if (result[i].getName() == "custom:organizationName") {
                Config.CUSTOMERID = result[i].getValue();
                Utils.log('Got userattrbute customerid {0}', Config.CUSTOMERID);
                me.processUserInitiatedLoginSuccess();
              }
            }
          }
        });
      },
      onFailure: (err) => {
        me.callback(null, err);
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
      && +this.authenticationDetails['lastLoggedInTime'] + 70 * 60 * 10000 > Date.now();
  }

  processUserInitiatedLoginSuccess() {
    this.lastAuthTokenCreationTime = Date.now();
    this.callback(AccessTokenService.authResult);
    AwsClient.reInitialize();
    this.serviceFactory.resetRegisteredServices();
  }

  private authTokenIsOld(): boolean {
    let now = Date.now();
    let authTokenAge = now - this.lastAuthTokenCreationTime;
    return authTokenAge > 30 * 60 * 1000;
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
