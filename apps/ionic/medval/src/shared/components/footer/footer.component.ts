import {Component, Input} from "@angular/core";

@Component({
  templateUrl: './footer.component.html',
  selector: 'mdval-footer'
})
export class FooterComponent {
  @Input() reassure: boolean;
}
