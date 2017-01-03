import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import { EmailProvider } from "./schema";

@Injectable()
export class EmailProviderService {

  constructor(private _http: Http) { }

  findEmailProviders = (userEmail: string): Observable<EmailProvider[]> => {
    return this._http.get('../assets/data/emailProvider.json')
      .map(response => this.mapEmailProvider(response, userEmail))
  }

  mapEmailProvider(response: Response, userEmail: string): EmailProvider[] {
    console.log(response);
    let emailProviderData = response.json();
    let arr: any = userEmail.split("@");
    let filteredEmailProviders: any;
    if (userEmail.indexOf("@") > 0) {
      filteredEmailProviders = emailProviderData.filter(ep => ep.name.toLowerCase().includes(("@" + arr[1]).toLowerCase()));
      for (var i = 0; i < filteredEmailProviders.length; i++) {
        filteredEmailProviders[i].name = arr[0] + filteredEmailProviders[i].name;
      }
      emailProviderData = [];
      return filteredEmailProviders;
    }
    else {
      return emailProviderData.filter(item => { return false });
    }
  }
}