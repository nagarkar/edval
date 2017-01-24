import {Component} from "@angular/core";


@Component({
  template: `
    <mdval-header title="Performance Dashboard"></mdval-header>
    <ion-content>
      <div class="m-t-4" padding>
        <campaign-tabs></campaign-tabs>
      </div>
    </ion-content>
  `,
})
export class ReportingDashboard {

  ngOnInit() {
    setTimeout(()=>{
      alert('This is a demonstration page. It is not pulling real data.')
    }, 1000);
  }
}
