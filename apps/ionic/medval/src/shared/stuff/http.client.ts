import {Utils} from "./utils";
import {AccessTokenService, AuthResult} from "../aws/access.token.service";
import {Http, Response, RequestOptionsArgs, Headers} from "@angular/http";
import {ErrorType} from "./error.types";
import {Injectable} from "@angular/core";
import {Config} from "../config";
import "rxjs/add/operator/toPromise";

@Injectable()
export class HttpClient<T> {

  constructor(
    private tokenProvider: AccessTokenService,
    private http: Http,
    private instance: T) {
  }

  /**
   * Pings the backend account.
   * Usage:
   *   this.httpClient.ping().then(
   *     res => alert(res),
   *     error => {
   *       this.errorMessage = <any>error;
   *       alert(error);
   *     }
   *   );
   * @returns {Promise<ErrorObservable|ErrorObservable>|Promise<TResult>}
   */
  public ping() : Promise<any>{
    // TODO Revert line
    if (1==1) throw ErrorType.UnsupportedOperation('http client');
    return this.http.get(Config.pingUrl, this.createRequestOptionsArgs())
      .toPromise()
      .then<any>(this.extractData)
      .catch<any>(this.handleError);
  }

  public list<T>(path : string | '') : Promise<Array<T>> {
    // TODO Revert line
    if (1==1) throw ErrorType.UnsupportedOperation('http client');
    return this.http.get(Config.baseUrl + path, this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public get<T>(path : string, id: string | '') : Promise<T> {
    // TODO Revert line
    if (1==1) throw ErrorType.UnsupportedOperation('http client');
    return  this.http.get(Config.baseUrl + path + "/" + id, this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public put<T>(path : string, id: string | '', body: T) : Promise<T> {
    // TODO Revert line
    if (1==1) throw ErrorType.UnsupportedOperation('http client');
    return this.http.put(Config.baseUrl + path + "/" + id, Utils.stringify(body), this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public post<T>(path : string, body: T) : Promise<T> {
    // TODO Revert line
    if (1==1) throw ErrorType.UnsupportedOperation('http client');
    return this.http.post(Config.baseUrl + path, Utils.stringify(body), this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public delete(path : string, id: string | '') : Promise<boolean> {
    // TODO Revert line
    if (1==1) throw ErrorType.UnsupportedOperation('http client');
    return this.http.delete(Config.baseUrl + path + "/" + id,
      this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData = (res: Response): any => {
    // Workaround for the fact the content type may be wrong
    Utils.log('in extract data' + Utils.stringify(res));
    let body: any;
    if (res.headers.get('content-type') == "application/json") {
      //this.utils.log("Extracted data res.json: " + Utils.stringify(res.json()));
      try {
        body = res.json();
        if (Array.isArray(body)) {
          body = (body as Array<any>).map((value: any) =>{
            return Object.assign<T, any>(this.newInstance(), value);
          });
        } else {
          body = Object.assign<T, any>(this.newInstance(), body);
        }
      } catch(error) {
        body = res.text();
        Utils.log('in extract data, error {0} occurred' + error);
        Utils.log('in extract data, response was: {0}, with text {1}' + res, res.text());
      }
    }
    return body;
  }

  private handleError  = (error: any): T | PromiseLike<T> => {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    Utils.log('in handle error' + Utils.stringify(error));
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || Utils.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    Utils.error(errMsg);
    return Promise.reject(errMsg);
  }

  private createRequestOptionsArgs() : RequestOptionsArgs {
    if (!this.tokenProvider.getAuthResult()) {
      ErrorType.throwNotLoggedIn();
    }
    let result : AuthResult = this.tokenProvider.getAuthResult();
    return {
      headers: new Headers({
        'X-AccessToken': result.accessToken,
        'X-IdToken': result.idToken,
        'Content-Type': "application/json",
        'Accept': 'application/json'
        //'Access-Control-Request-Headers': 'X-AccessToken, X-IdToken, Content-Type',
        //'Access-Control-Request-Method': method
      })
    }
  }


  private newInstance(): T {
    return Object.create(Object.getPrototypeOf(this.instance));
  }
}
