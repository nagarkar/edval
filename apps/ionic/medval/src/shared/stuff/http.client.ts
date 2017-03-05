/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
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
    return this.http.get(Config.pingUrl, HttpClient.createRequestOptionsArgs())
      .toPromise()
      .then((response: Response)=>{
        if (response.statusText.toLowerCase() != "ok") {
          throw response.statusText;
        }
        return response.text();
      })
  }

  public list<T>(path : string | '') : Promise<Array<T>> {
    return this.http.get(Config.baseUrl + path, HttpClient.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public get<T>(path : string, id: string | '') : Promise<T> {
    return  this.http.get(Config.baseUrl + path + "/" + id, HttpClient.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public put<T>(path : string, id: string | '', body: T) : Promise<T> {
    return this.http.put(Config.baseUrl + path + "/" + id, serialize(body), HttpClient.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public post<T>(path : string, body: T) : Promise<T> {
    return this.http.post(Config.baseUrl + path, serialize(body), HttpClient.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public delete(path : string, id: string | '') : Promise<void> {
    return this.http.delete(Config.baseUrl + path + "/" + id,
      HttpClient.createRequestOptionsArgs())
      .toPromise()
      .then((res: Response) => {
        if (this.extractData(res) != null) {
          return;
        } else {
          throw 'delete failed';
        }
      })
      .catch(this.handleError);
  }

  private extractData = (res: Response): any => {
    let body: any = null;
    try {
      if (res.headers.get('content-type') != "application/json") {
        let formattedErr = "Unexpected condition; content type was not jSON";
        Utils.error(formattedErr);
        throw formattedErr;
      }
      if (!res.ok || new String(res.statusText).toLowerCase() != "ok") {
        throw res.statusText;
      }
      body = res.json(); // try to parse it. This should always work, if not, handle the exception.
      if (!this.clazz) {
        return body;
      }
      if (Array.isArray(body)) {
        body = deserializeArray<T>(this.clazz, res.text());
      } else {
        body = deserialize<T>(this.clazz, res.text());
      }
    } catch(error) {
      let formattedErr = Utils.format("Eror: {0}, response: {1}, response.text: {2}", error, res, res.text());
      Utils.error(formattedErr);
      throw formattedErr;
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
    Utils.error("In Handle Error, with error {0}", errMsg);
    throw errMsg;
  }

  public static createRequestOptionsArgs() : RequestOptionsArgs {
    let result : AuthResult = AccessTokenService.authResult;
    return {
      headers: new Headers({
        'X-AccessToken': result? result.accessToken : '',
        'X-IdToken': result? result.idToken : '',
        'Content-Type': "application/json",
        'Accept': 'application/json'
      })
    }
  }
}
