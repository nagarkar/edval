import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Account} from "../../services/account/schema";
import {AccountService} from "../../services/account/delegator";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {MockAccountService} from "../../services/account/mock";
import {LiveAccountService} from "../../services/account/live";
import {AdminComponent} from "../admin.component";
import {Config} from "../../shared/config";

@Component({
  templateUrl: './account.component.html',
  providers: [ AccountService, MockAccountService, LiveAccountService ]
})

export class AccountComponent extends AdminComponent {

  constructor(protected tokenProvider: AccessTokenService,
              public navCtrl: NavController,
              protected utils: Utils,
              private accountSvc : AccountService,
  ) {
    super(tokenProvider, navCtrl, utils);
  }

  public account: Account = new Account();

  ngOnInit(): void {
    super.ngOnInit();
    this.accountSvc.get(Config.CUSTOMERID)
      .then((account: Account) => {
        this.account = account;
      })
      .catch(err => {
        Utils.error(err);
        this.utils.presentTopToast(err || "Could not retrieve Account");
      });
  }

  ngOnDestroy() {
    this.save();
  }

  public collectUrl() {
    this.utils.collectUrl((value) => {
      this.account.properties.logo = value;
    })
  }

  private save() {
    this.accountSvc.update(this.account)
      .then((res) => {
        this.utils.presentTopToast('Information saved successfully!.');
      })
      .catch((errResp) => {
        this.utils.presentTopToast(errResp || "Could not save Account");
      })
  }
}
