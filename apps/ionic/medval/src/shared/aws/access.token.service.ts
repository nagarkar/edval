import {Config} from "./config";
import {Injectable, EventEmitter} from "@angular/core";
import {Utils} from "../stuff/utils";
declare let AWS:any;
declare let AWSCognito:any;

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
  //private error: Error = null;

  loginEvent: EventEmitter<AuthResult> = new EventEmitter<AuthResult>();
  //loginFailed: EventEmitter = new EventEmitter();

  private authenticatingIntervalTimer : number = 0;

  constructor(private utils: Utils) {}

  public getAuthResult() : AuthResult {
    return this.authResult;
  }

  public getUserName() : string {
    return this._username;
  }

  public logout() : void {
    this._cognitoUser = null;
    this.clearAuthenticatingIntervalTimerIfValid();
    this.completeEvents();
    this.reinitializeEvents();
  }

  private completeEvents(): void {
    this.loginEvent.complete();
    //this.loginFailed.complete();
  }

  private reinitializeEvents(): void {
    this.loginEvent = new EventEmitter<AuthResult>();
    //this.loginFailed = new EventEmitter();
  }

  public supposedToBeLoggedIn(): boolean {
    return this._cognitoUser !== null;
  }

  public startNewSession(username : string, password : string): EventEmitter<AuthResult> {
    Utils.log("in token service: username:"+username+",password:"+password);
    this._username = username;
    var authenticationData = {
      Username : username,
      Password : password,
    };

    this.authenticationDetails =
      new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    const userPool =
      new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(Config.POOL_DATA);

    const userData = {
      Username : username,
      Pool : userPool
    };

    this._cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    this.startAuthenticatingUser();
    this.startAuthenticatingUserAtIntervals();

    return this.loginEvent;
  }

   get cognitoUser(): any {
    return this._cognitoUser;
  }


  private startAuthenticatingUserAtIntervals(): void {
    this.authenticatingIntervalTimer = setInterval(()=> {
      this.startAuthenticatingUser()
    }, Config.REFRESH_ACCESS_TOKEN)
  }

  /**
   let error: string = null;
   me._cognitoUser.getUserAttributes((err, result) => {
            if (err) {
              Utils.log("Error while trying to get cognito user attributes for user {0} ,{1}", err, Utils.stringify(this.authenticationDetails));
              error = err;
            }
            for (let i = 0; i < result.length; i++) {
              Utils.log('attribute {0}  has value {1}', result[i].getName(), result[i].getValue());
              if (result[i].getName() == "custom:organizationName") {
                Config.CUSTOMERID = result[i].getValue();
              }
            }
          });

   * @returns {Promise<T>|Promise}
   */

  private startAuthenticatingUser(): void {
    var me = this;
    this._cognitoUser.authenticateUser(this.authenticationDetails, {
      onSuccess: (session) => {
        Utils.log("onsuccess in token service");
        me.authResult = new AuthResult(
          session.getAccessToken().getJwtToken(),
          session.getIdToken().getJwtToken());
        Utils.log("created authresult");
        me.loginEvent.emit(me.authResult);
        Utils.log("emitted authresult");
      },
      onFailure: (err) => {
        //this.error = err;
        me.loginEvent.error(err);
      },
      newPasswordRequired: function(userAttributes, requiredAttributes) {
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.

        me.utils.presentAlertPrompt(
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
        me.utils.presentAlertPrompt(
          (data) => {
            me._cognitoUser.sendMFACode(data.value, this)
          },
          "Provide MFA", [{
            name: 'value',
            placeholder: 'Provide an MFA code:'
          }]);
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
