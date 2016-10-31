declare let AWS:any;
declare let AWSCognito:any;


import { Injectable}     from "@angular/core";
import { Observable, Observer }   from "rxjs";
import { Utils }                 from "../stuff/utils";
import { Config }              from "./config";

@Injectable()
export class AccessTokenService {

  private _cognitoUser : any = null;
  private _username : string = null;
  private authenticationDetails: any = null;
  private authResult: AuthResult = null;
  private error: Error = null;

  private _tokenObservable: Observable<AuthResult>;
  private authenticatingIntervalTimer : any;

  constructor(private utils: Utils) {
    this._tokenObservable = Observable.create((observer: Observer<AuthResult>) => {
      var intervalTimer = setInterval(() => {
        if (this.hasError()) {
          observer.error(this.error);
        } else if (this.authResult != null) {
          observer.next(this.authResult);
        }
      }, Config.REFRESH_ACCESS_TOKEN);

      // Note that this is optional, you do not have to return this if you require no cleanup
      return () => {
        clearInterval(intervalTimer);
        console.log('disposed');
      };
    });
  }

  public getAuthResult() : AuthResult {
    return this.authResult;
  }

  public getUserName() : string {
    return this._username;
  }

  public logout() : void {
    this._cognitoUser = null;
  }

  private hasError(): boolean {
    return this.error === null;
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

  get tokenObservable(): Observable<AuthResult> {
    return this._tokenObservable;
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
          this.utils.log("AccessToken:" + session.getAccessToken().getJwtToken());
          this.utils.log("IdToken:" + session.getIdToken().getJwtToken());
          resolve(this.authResult);  // fulfilled successfully
          this.utils.log("Finished Logging in :" + this._username);
        },
        onFailure: (err) => {
          this.error = err;
          reject(err);
        },
        newPasswordRequired: function(userAttributes, requiredAttributes) {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.

          // Get these details and call
          this.utils.presentAlertPrompt(
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
          this.utils.presentAlertPrompt(
            (data) => {
              me._cognitoUser.sendMFACode(data.value, this)
            },
            "Provide MFA",
            [
              {
                name: 'value',
                placeholder: 'Provide an MFA code:'
              }
            ]);
        }
      });
    });
  }

  private startAuthenticatingIntervalTimer(interval : number) {
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
