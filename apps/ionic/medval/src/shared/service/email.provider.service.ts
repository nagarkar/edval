/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Utils} from "../stuff/utils";
@Injectable()
export class EmailProviderService {

  constructor(private http: Http) {}

  findEmailProviders() {
    return this.http.get('assets/data/emailProvider.json')
      .toPromise()
      .then(res => <any[]> res.json().data)
      .then(data => { return data; })
      .catch((err)=> Utils.error(err));
  }
}
