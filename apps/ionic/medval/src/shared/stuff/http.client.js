import { Utils } from "./utils";
import { AccessTokenService } from "../aws/access.token.service";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { ErrorType } from "./error.types";
import { Injectable } from "@angular/core";
import { Config } from "../aws/config";
export var HttpClient = (function () {
    function HttpClient(utils, tokenProvider, http, instance) {
        var _this = this;
        this.utils = utils;
        this.tokenProvider = tokenProvider;
        this.http = http;
        this.instance = instance;
        this.extractData = function (res) {
            // Workaround for the fact the content type may be wrong
            Utils.log('in extract data' + Utils.stringify(res));
            var body;
            if (res.headers.get('content-type') == "application/json") {
                //this.utils.log("Extracted data res.json: " + Utils.stringify(res.json()));
                try {
                    body = res.json();
                    if (Array.isArray(body)) {
                        body = body.map(function (value) {
                            return Object.assign(_this.newInstance(), value);
                        });
                    }
                    else {
                        body = Object.assign(_this.newInstance(), body);
                    }
                }
                catch (error) {
                    body = res.text();
                    Utils.log('in extract data, error {0} occurred' + error);
                    Utils.log('in extract data, response was: {0}, with text {1}' + res, res.text());
                }
            }
            return body;
            //throw Promise.throw("Invalid Content-TYpe; Only application/json or subject is supported")
        };
        this.handleError = function (error) {
            // In a real world app, we might use a remote logging infrastructure
            var errMsg;
            Utils.log('in handle error' + Utils.stringify(error));
            if (error instanceof Response) {
                var body = error.json() || '';
                var err = body.error || Utils.stringify(body);
                errMsg = error.status + " - " + (error.statusText || '') + " " + err;
            }
            else {
                errMsg = error.message ? error.message : error.toString();
            }
            Utils.error(errMsg);
            return null;
            //return Promise.throw(errMsg);
        };
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
    HttpClient.prototype.ping = function () {
        // TODO Revert line
        if (1 == 1)
            throw ErrorType.UnsupportedOperation('http client');
        return this.http.get(Config.pingUrl, this.createRequestOptionsArgs())
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    HttpClient.prototype.list = function (path) {
        // TODO Revert line
        if (1 == 1)
            throw ErrorType.UnsupportedOperation('http client');
        return this.http.get(Config.baseUrl + path, this.createRequestOptionsArgs())
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    HttpClient.prototype.get = function (path, id) {
        // TODO Revert line
        if (1 == 1)
            throw ErrorType.UnsupportedOperation('http client');
        return this.http.get(Config.baseUrl + path + "/" + id, this.createRequestOptionsArgs())
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    HttpClient.prototype.put = function (path, id, body) {
        // TODO Revert line
        if (1 == 1)
            throw ErrorType.UnsupportedOperation('http client');
        var response = this.http.put(Config.baseUrl + path + "/" + id, Utils.stringify(body), this.createRequestOptionsArgs());
        var responsePromise = response.toPromise();
        return responsePromise
            .then(this.extractData)
            .catch(this.handleError);
    };
    HttpClient.prototype.post = function (path, body) {
        // TODO Revert line
        if (1 == 1)
            throw ErrorType.UnsupportedOperation('http client');
        return this.http.post(Config.baseUrl + path, Utils.stringify(body), this.createRequestOptionsArgs())
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    HttpClient.prototype.delete = function (path, id) {
        // TODO Revert line
        if (1 == 1)
            throw ErrorType.UnsupportedOperation('http client');
        return this.http.delete(Config.baseUrl + path + "/" + id, this.createRequestOptionsArgs())
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    HttpClient.prototype.createRequestOptionsArgs = function () {
        if (!this.tokenProvider.getAuthResult()) {
            return Observable.throw(ErrorType.NotLoggedIn);
        }
        var result = this.tokenProvider.getAuthResult();
        return {
            headers: new Headers({
                'X-AccessToken': result.accessToken,
                'X-IdToken': result.idToken,
                'Content-Type': "application/json",
                'Accept': 'application/json'
            })
        };
    };
    HttpClient.prototype.newInstance = function () {
        return Object.create(Object.getPrototypeOf(this.instance));
    };
    HttpClient.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    HttpClient.ctorParameters = [
        { type: Utils, },
        { type: AccessTokenService, },
        { type: Http, },
        null,
    ];
    return HttpClient;
}());
//# sourceMappingURL=http.client.js.map