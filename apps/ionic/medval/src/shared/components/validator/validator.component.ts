import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../../../shared/components/validator/validation.service';

@Component({
  selector: 'validator',
  template: `<div *ngIf="errorMessage !== null" style="color:#E82C0C;">{{errorMessage}}</div>`
})
export class ValidatorComponent {
  @Input() control: FormControl;
  constructor() { }

  get errorMessage(): string {
    for (let propertyName in this.control.errors) {
      if (this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}