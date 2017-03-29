/**
 * Created by chinmay on 3/3/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component} from "@angular/core";
import {InAppPurchase} from "ionic-native";
import {Utils} from "../../shared/stuff/utils";

@Component({
  selector:'subscription',
  template: `
    <ion-content>
      <div *ngIf="products.length == 0">
        <h3>Subscriptions could not be loaded</h3>
      </div>
      <div *ngFor="let product of products" class="border-around-text">
        <h3>{{product.title}}</h3>
        <h4>{{product.price}}</h4>
        <button ion-button primary-button (click)="purchase(product)">Buy</button>
      </div>
    </ion-content>
  `
})
export class SubscriptionComponent {

  productIds: string[] = ['com.yourapp.prod1', 'com.yourapp.prod2'];

  products: Object[] = [];

  ngOnInit() {
    InAppPurchase.getProducts(this.productIds)
      .then((products) => {
        this.products = products;
      })
      .catch(function (err) {
        Utils.log(err);
      });
  }

  purchase(product) {

  }
}
