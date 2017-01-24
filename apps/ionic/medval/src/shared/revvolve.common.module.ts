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
