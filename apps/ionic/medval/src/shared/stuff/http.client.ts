import {Utils, ClassType} from "./utils";
import {AccessTokenService, AuthResult} from "../aws/access.token.service";
import {Http, Response, RequestOptionsArgs, Headers} from "@angular/http";
import {Injectable} from "@angular/core";
import {Config} from "../config";
import "rxjs/add/operator/toPromise";
import {deserializeArray, deserialize, serialize} from "class-transformer";

@Injectable()
export class HttpClient<T> {

  /**
   * @param http
   * @param clazz Used for serialization using class-transformer library.
   */
  constructor(
    private http: Http,
    private clazz?: ClassType<T>) {
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
  public ping() : Promise<string>{
    // TODO Revert line
    return this.http.get(Config.pingUrl, this.createRequestOptionsArgs())
      .toPromise()
      .then((response: Response)=>{return response.text();})
      .catch((err)=> {return Promise.reject(err);});
  }

  public list<T>(path : string | '') : Promise<Array<T>> {
    return this.http.get(Config.baseUrl + path, this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public get<T>(path : string, id: string | '') : Promise<T> {
    return  this.http.get(Config.baseUrl + path + "/" + id, this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public put<T>(path : string, id: string | '', body: T) : Promise<T> {
    return this.http.put(Config.baseUrl + path + "/" + id, serialize(body), this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public post<T>(path : string, body: T) : Promise<T> {
    return this.http.post(Config.baseUrl + path, serialize(body), this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public delete(path : string, id: string | '') : Promise<void> {
    return this.http.delete(Config.baseUrl + path + "/" + id,
      this.createRequestOptionsArgs())
      .toPromise()
      .then((res: Response) => {
        if (this.extractData(res) != null) {
          return;
        } else {
          Promise.reject('http.client delete failed');
        }
      })
      .catch(this.handleError);
  }

  private extractData = (res: Response): any => {
    let body: any = null;
    try {
      if (res.headers.get('content-type') != "application/json") {
        Utils.error("Unexpected condition; content type was not jSON");
        Utils.throw("Unexpected condition; content type was not jSON");
      }
      body = res.json(); // try to parse it. This should always work, if not, handle the exception.
      if (body.status && new String(body.status).toLowerCase() == "ok") {
        return true;
      }
      if (!this.clazz) {
        return body;
      }
      if (Array.isArray(body)) {
        body = deserializeArray<T>(this.clazz, res.text());
      } else {
        body = deserialize<T>(this.clazz, res.text());
      }
    } catch(error) {
      Utils.error('in extract data, error {0} occurred' + error);
      Utils.error('in extract data, response was: {0}, with text {1}' + res, res.text());
    }
    return body;
  }

  private handleError  = (error: Response | any): T | PromiseLike<T> => {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      let err = body.error;
      if (err == null) {
        try {
          err = JSON.stringify(body);
        } catch (err) {Utils.error("Could not stringify error {0} in HttpClient.handleError", err)}
      }
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    Utils.error(errMsg);
    return Promise.reject(errMsg);
  }

  private createRequestOptionsArgs() : RequestOptionsArgs {
    let result : AuthResult = AccessTokenService.authResult;
    return {
      headers: new Headers({
        'X-AccessToken': result? result.accessToken : '',
        'X-IdToken': result? result.idToken : '',
        'Content-Type': "application/json",
        'Accept': 'application/json'
        //'Access-Control-Request-Headers': 'X-AccessToken, X-IdToken, Content-Type',
        //'Access-Control-Request-Method': method
      })
    }
  }
}
