declare let AWS:any;
declare let AWSCognito:any;


import { Injectable, Inject }     from "@angular/core";
import { Observable, Observer }   from "rxjs";
import { Logger }                 from "../logger.service";
import { AWSConfig }              from "./config";

@Injectable()
export class AccessTokenProvider {

  private _cognitoUser : any = null;
  private username : string = null;
  private authenticationDetails: any = null;
  private authResult: AuthResult = null;
  private error: Error = null;

  private _tokenObservable: Observable<AuthResult>;
  private authenticatingIntervalTimer : any;

  constructor(@Inject(Logger) private logger) {
    this._tokenObservable = Observable.create((observer: Observer<AuthResult>) => {
      var intervalTimer = setInterval(() => {
        if (this.hasError()) {
          observer.error(this.error);
        } else if (this.authResult != null) {
          observer.next(this.authResult);
        }
      }, AWSConfig.REFRESH_ACCESS_TOKEN);

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

  public logout() : void {
    this._cognitoUser = null;
  }

  private hasError(): boolean {
    return this.error === null;
  }

  public supposedToBeLoggedIn(): boolean {
    return this._cognitoUser !== null;
  }

  public startNewSession(username : string, password : string): Promise<string> {

    this.username = username;
    var authenticationData = {
      Username : username,
      Password : password,
    };

    this.authenticationDetails =
      new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    const userPool =
      new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(AWSConfig.POOL_DATA);

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
    this.startAuthenticatingIntervalTimer(AWSConfig.REFRESH_ACCESS_TOKEN);
    return promise;
  }

  private startAuthenticatingUser() : Promise<AuthResult> {
    return new Promise((resolve, reject) => {
      this._cognitoUser.authenticateUser(this.authenticationDetails, {
        onSuccess: (session) => {
          this.authResult = new AuthResult(
            session.getAccessToken().getJwtToken(),
            session.getIdToken().getJwtToken());
          this.logger.log("AccessToken:" + session.getAccessToken().getJwtToken());
          this.logger.log("IdToken:" + session.getIdToken().getJwtToken());
          resolve(this.authResult);  // fulfilled successfully
          this.logger.log("Finished Logging in :" + this.username);
        },
        onError: (err) => {
          this.error = err;
          reject(err);
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
