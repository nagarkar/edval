import { Injectable } from "@angular/core";
import { Utils } from "../stuff/utils";
export var AccessTokenService = (function () {
    function AccessTokenService(utils) {
        this.utils = utils;
        this._cognitoUser = null;
        this._username = null;
        this.authenticationDetails = null;
        this.authResult = null;
        this.error = null;
        /* TODO Revert
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
        */
    }
    AccessTokenService.prototype.getAuthResult = function () {
        return new AuthResult(null, null);
        /** TODO Revert
        return this.authResult;
         */
    };
    AccessTokenService.prototype.getUserName = function () {
        return 'celeron';
        /** TODO Revert
        return this._username;
         */
    };
    AccessTokenService.prototype.logout = function () {
        this._cognitoUser = null;
    };
    AccessTokenService.prototype.hasError = function () {
        return this.error === null;
    };
    AccessTokenService.prototype.supposedToBeLoggedIn = function () {
        return true;
        /** TODO revert
        return this._cognitoUser !== null;
         */
    };
    /** TODO revert
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
     **/
    /** TODO Revert
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
            //Utils.log("Finished Logging in :" + this._username);
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
     */
    AccessTokenService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AccessTokenService.ctorParameters = [
        { type: Utils, },
    ];
    return AccessTokenService;
}());
export var AuthResult = (function () {
    function AuthResult(accessToken, idToken) {
        this.accessToken = accessToken;
        this.idToken = idToken;
    }
    return AuthResult;
}());
//# sourceMappingURL=access.token.service.js.map