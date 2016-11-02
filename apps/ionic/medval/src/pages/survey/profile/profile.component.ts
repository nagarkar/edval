import { Component, Input } from '@angular/core';

import { NavController } from 'ionic-angular';
@Component({
    selector: 'prodocuer-profile',
    template: `<ion-grid>
    <ion-row>
        <ion-col width-50 offset-25>
            <div class="ion-profile-picture ">
            <img src="{{imgUrl}}" type="file" accept="image/*" capture />
            </div>
        </ion-col>
    </ion-row>
    </ion-grid>`
})
export class ProfileComponent {

    @Input() imgUrl: string = "http://tr3.cbsistatic.com/fly/bundles/techrepubliccore/images/icons/standard/icon-user-default.png";

    constructor(private navCtrl: NavController) { }



}
