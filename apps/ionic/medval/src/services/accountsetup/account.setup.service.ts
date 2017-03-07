/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "../../shared/stuff/http.client";
import {Account} from "../account/schema";

@Injectable()
export class AccountSetupService {

  private http: HttpClient<boolean>;
  private httpA: HttpClient<AccountSetup>;
  private httpString: HttpClient<string>;

  constructor(http: Http) {

    this.http = new HttpClient<boolean>(http);
    this.httpA = new HttpClient<AccountSetup>(http);
    this.httpString = new HttpClient<string>(http);
  }

  userexists(username: string): Promise<boolean> {
    return this.http.get("/api/accountsetup/userexists", username);
  }

  customerexists(customerId: string): Promise<boolean> {
    return this.http.get("/api/accountsetup/customerexists", customerId);
  }

  create(accountSetup: AccountSetup): Promise<AccountSetup> {
    return this.httpA.post("/api/accountsetup", accountSetup);
  }

  forgotPassword(username: string): Promise<string> {
    return this.httpString.get("/api/accountsetup/forgotpassword", username);
  }
}

export interface AccountSetup {
  customer: Account;
  emailAddress: string;
  phoneNumber?: string;
  userName: string
}
