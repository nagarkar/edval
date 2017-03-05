/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, Input} from "@angular/core";
import {ModalController} from "ionic-angular";
import {SuggestionComponent} from "../suggestions/suggestions.page";

@Component({
  templateUrl: './footer.component.html',
  selector: 'mdval-footer'
})
export class FooterComponent {

  constructor(private modalCtrl: ModalController) {}

  @Input() reassure: boolean;

  @Input() showLastWin: boolean;

  @Input() showSuggestionBox: boolean;

  displaySuggestionBox() {
    this.modalCtrl.create(SuggestionComponent).present();
  }
}
