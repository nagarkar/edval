import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular";

/**
 * Shows the header, including the account logo. If not logged in, logo is not shown.
 */
@Component({
  templateUrl: 'header.component.html',
  selector: 'mdval-header'
})
export class HeaderComponent {

  static HOME_MAP = { }
  static DEFAULT_HOME: Function = null;

  @Input() title: string;

  /** '' home tells this component not to show the home icon **/
  @Input() home: string;

  constructor(private navCtrl: NavController) { }

  goHome() {
    this.navCtrl.setRoot(HeaderComponent.HOME_MAP[this.home] || HeaderComponent.DEFAULT_HOME);
  }
}
