import {Component} from "@angular/core";
import {NavController, ActionSheetController, AlertController, ToastController} from "ionic-angular";
import {Account} from "../../services/account/schema";
import {AccountService} from "../../services/account/delegator";
import {Utils} from "../../shared/stuff/utils";
import {MockAccountService} from "../../services/account/mock";
import {LiveAccountService} from "../../services/account/live";
import {AdminComponent} from "../admin.component";
import {Config} from "../../shared/config";

@Component({
  templateUrl: './account.component.html',
  providers: [ AccountService, MockAccountService, LiveAccountService ]
})

export class AccountComponent extends AdminComponent {

  constructor(private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              navCtrl: NavController,
              private accountSvc : AccountService,
  ) {
    super(navCtrl);
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
        Utils.presentTopToast(this.toastCtrl, err || "Could not retrieve Account");
      });
  }

  ngOnDestroy() {
    this.save();
  }

  public collectUrl() {
    Utils.collectUrl(this.alertCtrl, this.actionSheetCtrl, (value): void => {
      this.account.properties.logo = value;
    })
  }

  private save() {
    this.accountSvc.update(this.account)
      .then((res) => {
        Utils.presentTopToast(this.toastCtrl, 'Information saved successfully!.');
      })
      .catch((errResp) => {
        Utils.presentTopToast(this.toastCtrl, errResp || "Could not save Account");
      })
  }
}
