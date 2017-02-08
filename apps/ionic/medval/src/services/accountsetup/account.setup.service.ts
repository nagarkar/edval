/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {Http} from "@angular/http";
import {HttpClient} from "../../shared/stuff/http.client";
import {Account} from "../account/schema";

@Injectable()
export class AccountSetupService {

  private http: HttpClient<boolean>;
  private httpA: HttpClient<AccountSetup>;

  constructor(http: Http) {

    this.http = new HttpClient<boolean>(http);
    this.httpA = new HttpClient<AccountSetup>(http);
  }

  userexists(username: string): Promise<boolean> {
    return this.http.get("/api/accountsetup/userexists", username).then((data: boolean) => {
      return data;
    }).catch((err)=> Utils.error(err));
  }

  customerexists(customerId: string): Promise<boolean> {
    return this.http.get("/api/accountsetup/customerexists", customerId).then((data: boolean) => {
      return data;
    }).catch((err)=> Utils.error(err));
  }

  create(accountSetup: AccountSetup): Promise<AccountSetup> {
    return this.httpA.post("/api/accountsetup", accountSetup).then((result: AccountSetup) => {
      return result;
    }).catch((err)=> Utils.error(err));
  }

  forgotPassword(username: string): Promise<string> {
    return this.httpA.get("/api/accountsetup/forgotpassword", username).then((result: string) => {
      return result;
    }).catch((err)=> Utils.error(err));
  }
}

export interface AccountSetup {
  customer: Account;
  emailAddress?: string;
  phoneNumber: string;
  userName: string
}
