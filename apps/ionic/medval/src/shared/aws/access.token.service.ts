import {Config} from "./config";
import {Injectable} from "@angular/core";
import {Utils} from "../stuff/utils";
declare let AWS:any;
declare let AWSCognito:any;

@Injectable()
export class AccessTokenService {

  private _cognitoUser : any = null;
  private _username : string = null;
  private authenticationDetails: any = null;
  private authResult: AuthResult = null;
  private error: Error = null;

  private authenticatingIntervalTimer : any;

  constructor(private utils: Utils) {}

  public getAuthResult() : AuthResult {
    return this.authResult;
  }

  public getUserName() : string {
    return this._username;
  }

  public logout() : void {
    this._cognitoUser = null;
  }

  public supposedToBeLoggedIn(): boolean {
    return this._cognitoUser !== null;
  }

  public startNewSession(username : string, password : string): Promise<AuthResult> {

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
    return this.startAuthenticatingUserAtIntervals();
  }

   get cognitoUser(): any {
    return this._cognitoUser;
  }


  private startAuthenticatingUserAtIntervals() : Promise<AuthResult> {
    const promise : Promise<AuthResult> = this.startAuthenticatingUser();
    this.startAuthenticatingIntervalTimer(Config.REFRESH_ACCESS_TOKEN);
    return promise;
  }

  private startAuthenticatingUser() : Promise<AuthResult> {
    return new Promise((resolve, reject) => {
      var me = this;
      this._cognitoUser.authenticateUser(this.authenticationDetails, {
        onSuccess: (session) => {
          this.authResult = new AuthResult(
            session.getAccessToken().getJwtToken(),
            session.getIdToken().getJwtToken());

          me._cognitoUser.getUserAttributes((err, result) => {
            if (err) {
              Utils.log("Error while trying to get cognito user attributes for user {0}", this.authenticationDetails);
              return;
            }
            for (let i = 0; i < result.length; i++) {
              Utils.log('attribute {0}  has value {1}', result[i].getName(), result[i].getValue());
              if (result[i].getName() == "custom:organizationName") {
                Config.CUSTOMERID = result[i].getValue();
              }
            }
            resolve(this.authResult);  // fulfilled successfully
          });
        },
        onFailure: (err) => {
          this.error = err;
          reject(err);
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
    });
  }

  private startAuthenticatingIntervalTimer(interval : number): void {
    clearInterval(this.authenticatingIntervalTimer);
    this.authenticatingIntervalTimer = setInterval(() => {
      if (this.supposedToBeLoggedIn()) {
        this.startAuthenticatingUser();
      }
    }, interval);
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
