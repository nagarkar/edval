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

  private _cognitoUser : any = null;
  private _username : string = null;
  private authenticationDetails: any = null;
  private authResult: AuthResult = null;
  private userPool: any = null;
  //private error: Error = null;

  private callback: (result?: AuthResult, err?: any) => void;

  private authenticatingIntervalTimer : number = 0;

  constructor(private alertCtrl: AlertController, private serviceFactory: ServiceFactory) {}

  public getAuthResult() : AuthResult {
    return this.authResult;
  }

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
    return this._cognitoUser !== null;
  }

  public startNewSession(
    username : string,
    password : string,
    fn: (result: AuthResult, err: any)=> void) {
    this.callback = fn;
    this._username = username;
    var authenticationData = {
      Username : username,
      Password : password,
    };

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
    this.authenticatingIntervalTimer = window.setInterval(()=> {
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
        me.authResult = new AuthResult(
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
          region: Config.AWS_CONFIG.region
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
            Utils.log('Got userattrbute result with {0} results', result.length);
            // TODO: When this goes beyond one customer, need to assign an organization name to each login.
            //for (let i = 0; i < result.length; i++) {
            //  if (result[i].getName() == "custom:organizationName") {
                me.callback(me.authResult);
                //Config.CUSTOMERID = result[i].getValue();
                Config.CUSTOMERID = "OMC";
                Utils.log('Got userattrbute customerid {0}', Config.CUSTOMERID);
                AwsClient.reInitialize();
                me.serviceFactory.resetRegisteredServices();
            //  }
            //}
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
    if (this.authenticatingIntervalTimer != 0) {
      clearInterval(this.authenticatingIntervalTimer);
    }
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
