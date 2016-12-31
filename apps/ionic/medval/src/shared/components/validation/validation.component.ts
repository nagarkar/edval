import {Component, Input} from "@angular/core";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'validator',
  template: `<div *ngIf="!control.valid" style="color:#E82C0C;">{{errorMessage}}</div>`
})
export class ValidationComponent {

  @Input() control: FormControl;
  @Input() errorMessage: string;

  constructor() { }

  /*
  get errorMessage(): string {
    for (let propertyName in this.control.errors) {
      if (this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }*/
}
