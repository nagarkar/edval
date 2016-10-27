import {Logger} from "../logger.service";
import {AccessTokenProvider, AuthResult} from "../aws/access.token.service";
import {Http, Response, RequestOptionsArgs, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {ErrorType} from "./error.types";
import {Injectable} from "@angular/core";

@Injectable()
export class HttpClient<T> {

  private static BASE_URL: string = "https://testapi.healthcaretech.io";
  private static PING_URL: string = "https://testapi.healthcaretech.io/api/ping";

  constructor(private logger: Logger, private tokenProvider: AccessTokenProvider, private http: Http) { }

  public ping() : Promise<string>{
    return this.http.get(HttpClient.PING_URL, this.createRequestOptionsArgs("GET"))
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public list(url : string | '') : Promise<T[]> {
    return this.http.get(url, this.createRequestOptionsArgs("GET"))
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public get(path : string, id: string | '') : Promise<T> {
    return this.http.get(HttpClient.BASE_URL + path + id, this.createRequestOptionsArgs("GET"))
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public post(path : string, body: any) : Promise<T> {
    return this.http.post(HttpClient.BASE_URL + path + JSON.stringify(body),
      this.createRequestOptionsArgs("POST"))
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  public put(path : string, id: string | '', body: any) : Promise<T> {
    return this.http.put(HttpClient.BASE_URL + path + id, JSON.stringify(body),
      this.createRequestOptionsArgs("PUT"))
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public delete(path : string, id: string | '') : Promise<boolean> {
    return this.http.put(HttpClient.BASE_URL + path + id,
      this.createRequestOptionsArgs("DELETE"))
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    // Workaround for the fact the content type may be wrong
    if (res.headers.get('content-type') == "application/json") {
      try {
        let body = res.json();
        return body || {};
      } catch (error) {
        // TODO Fix this on server side.
        // Workaround for the fact that server is returning 'application/json' content type for textual ping response
        let body = res.text();
        return body || 'null text';
      }
    } else if (res.headers.get('content-type') == "text") {
      let body = res.text();
      return body || {};
    }
    throw Observable.throw("Invalid Content-TYpe; Only application/json or text is supported")
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private createRequestOptionsArgs(method: string, contentType? : string) : RequestOptionsArgs {
    if (!this.tokenProvider.getAuthResult()) {
      return Observable.throw(ErrorType.NotLoggedIn);
    }
    let result : AuthResult = this.tokenProvider.getAuthResult();
    return {
      headers: new Headers({
        'X-AccessToken': result.accessToken,
        'X-IdToken': result.idToken,
        'Content-Type': contentType ? contentType : "application/json",
        'Accept': contentType ? contentType: 'application/json',
        //'Access-Control-Request-Headers': 'X-AccessToken, X-IdToken, Content-Type',
        //'Access-Control-Request-Method': method
      })
    }
  }
}
