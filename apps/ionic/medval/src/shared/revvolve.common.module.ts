/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {CommonModule} from "@angular/common";
import {IonicModule} from "ionic-angular";
import {NgModule} from "@angular/core";
import {AccessTokenService} from "./aws/access.token.service";
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {ProgressbarComponent} from "./components/progressbar/progressbar.component";

@NgModule({
  imports: [CommonModule, IonicModule],
  exports: [HeaderComponent, FooterComponent, ProgressbarComponent],
  providers: [AccessTokenService],
  declarations: [HeaderComponent, FooterComponent, ProgressbarComponent]
})
export class RevvolveCommonModule {

}
