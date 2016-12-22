import {Component, OnInit, Input} from "@angular/core";
import {AccountService} from "../../services/account/delegator";
import {NavController} from "ionic-angular";
import {Utils} from "../stuff/utils";
import {Account} from "../../services/account/schema";
import {Config} from "../aws/config";
import {LoginComponent} from "../../pages/login/login.component";

/**
 * Shows the header, including the account logo. If not logged in, logo is not shown.
 */
@Component({
  templateUrl: 'header.component.html',
  selector: 'mdval-header'
})
export class HeaderComponent implements OnInit {

  public account: Account = new Account();

  @Input() title: string;
  @Input() rightIconName: string;

  constructor(
    private accountSvc : AccountService,
    private navCtrl: NavController,
    private utils: Utils // instance required for navigation.
  ) {
    Utils.log("Created header");
  }

  gotoLogin() {
    this.utils.setRoot(this.navCtrl, LoginComponent)
  }

  ngOnInit() {
    this.getAccount();
  }

  private getAccount() {
    this.accountSvc.get(Config.CUSTOMERID)
      .then((account: Account) => {
        this.account = account;
      })
      .catch(error => {
        // no op; don't show the image
      });
  }
}
