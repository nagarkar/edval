/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, Input, ViewChild, Renderer, Output, EventEmitter} from "@angular/core";
import {NavController, Navbar, NavParams} from "ionic-angular";
import {Utils} from "../../stuff/utils";
import {AnyComponent} from "../../../pages/any.component";

/**
 * Shows the header, including the account logo. If not logged in, logo is not shown.
 */
@Component({
  templateUrl: './header.component.html',
  selector: 'mdval-header'
})
export class HeaderComponent extends AnyComponent {

  static HOME_MAP = { }
  static DEFAULT_HOME: Function = null;

  @Input() title: string = null;

  @Input() rightIcon: string = 'exit';

  @Input() leftIcon: string = 'build';

  @Input() proceedOnRightClick: ()=>Promise<boolean> = ()=> {return Promise.resolve(true);};

  /** '' home tells this component to show the home icon on right **/
  @Input() home: string = null;

  /** '' tells this component to show the home icon on left**/
  @Input() leftHome: string;

  @ViewChild("navbar")
  navbar: Navbar;

  constructor(private navCtrl: NavController, private renderer: Renderer, private navParams: NavParams) {
    super();
    this.rightIcon = navParams.get('rightIcon') || this.rightIcon;
    this.leftIcon = navParams.get('leftIcon') || this.leftIcon;
  }

  ngOnInit() {
    let navBar: HTMLElement = this.navbar.getElementRef().nativeElement;
    let results: NodeListOf<Element> = navBar.getElementsByClassName('toolbar-background');
    let backgroundEl: HTMLElement = results[0] as HTMLElement;
    this.renderer.setElementStyle(backgroundEl, 'backgroundColor',this.primaryColor);
    let backButtons = navBar.getElementsByClassName('back-button');
    if (backButtons && backButtons.length> 0) {
      this.renderer.setElementStyle(backButtons[0], 'color', this.iconColor);
    }
  }

  goHome() {
    this.proceedOnRightClick()
      .then((result)=>{
        if (result) {
          Utils.setRoot(this.navCtrl, HeaderComponent.HOME_MAP[this.home] || HeaderComponent.DEFAULT_HOME);
        }
      });
    }

  goLeftHome() {
    Utils.setRoot(this.navCtrl, HeaderComponent.HOME_MAP[this.leftHome]);
  }
}
