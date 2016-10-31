import {Utils} from "./utils";
import {AccessTokenService, AuthResult} from "../aws/access.token.service";
import {Http, Response, RequestOptionsArgs, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {ErrorType} from "./error.types";
import {Injectable} from "@angular/core";

@Injectable()
export class HttpClient {

  private baseUrl: string = "https://testapi.healthcaretech.io";
  private pingUrl: string = "https://testapi.healthcaretech.io/api/ping";
  //private baseUrl: string = "http://192.168.57.1:8090";
  //private pingUrl: string = "http://192.168.57.1:8090/api/ping";

  constructor(
    private utils: Utils,
    private tokenProvider: AccessTokenService,
    private http: Http) {

    this.setupDefaultUrls();
  }

  /**
   * Pings the backend service.
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
    return this.http.get(this.pingUrl, this.createRequestOptionsArgs())
      .toPromise()
      .then<string>(this.extractData)
      .catch<string>(this.handleError);
  }

  public list<T>(path : string | '') : Promise<T[]> {
    return this.http.get(this.baseUrl + path, this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public get<T>(path : string, id: string | '') : Promise<T> {
    return  this.http.get(this.baseUrl + path + "/" + id, this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
    /*
      .map((res: Response) => res.json())
      .catch((error) =>{
        this.utils.error(JSON.stringify(error));
        return Observable.throw(error);
      });
      */
  }

  public put<T>(path : string, id: string | '', body: T) : Promise<T> {
    let response: Observable<Response> = this.http.put(this.baseUrl + path + "/" + id, JSON.stringify(body),
      this.createRequestOptionsArgs());
    let responsePromise : Promise<Response> = response.toPromise();
    return responsePromise
      .then<T>(this.extractData)
      .catch<T>(this.handleError);
  }

  public post<T>(path : string, body: T) : Promise<T> {
    return this.http.post(this.baseUrl + path, JSON.stringify(body),
      this.createRequestOptionsArgs())
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  public delete(path : string, id: string | '') : Promise<boolean> {
    return this.http.delete(this.baseUrl + path + "/" + id,
      this.createRequestOptionsArgs())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData<T>(res: Response) : T {
    // Workaround for the fact the content type may be wrong
    console.log('in extract data' + JSON.stringify(res));
    let body: T;
    if (res.headers.get('content-type') == "application/json") {
      console.log("Extracted data res.json: " + JSON.stringify(res.json()));
      let json;
      try {
        json = res.json();
      } catch(error) {
        json = res.text();
      }
      body = json;
    }
    return body;
    //throw Promise.throw("Invalid Content-TYpe; Only application/json or subject is supported")
  }

  private handleError<T> (error: Response | any) : T {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    console.log('in handle error' + JSON.stringify(error));
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return null;
    //return Promise.throw(errMsg);
  }

  private createRequestOptionsArgs() : RequestOptionsArgs {
    if (!this.tokenProvider.getAuthResult()) {
      return Observable.throw(ErrorType.NotLoggedIn);
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

  private setupDefaultUrls() {
    if (this.utils.isDesktop()) {
      this.baseUrl = "http://localhost:8090";
      this.pingUrl = "http://localhost:8090/api/ping";
    } else if (this.utils.isAndroid()) {
      this.baseUrl = "http://192.168.57.1:8090";
      this.pingUrl = "http://192.168.57.1:8090/api/ping";
    }
  }
}
