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
