import {FormControl, ValidatorFn, Validators} from "@angular/forms";
export class ValidationService {

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any): string {
    let config = {
      'required': 'Required',
      'invalidPhoneAddress': 'Invalid phone number',
    };
    return config[validatorName];
  }

  static EmailValidator: ValidatorFn = Validators.pattern(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  static PhoneValidator: ValidatorFn = Validators.pattern(/^\([0-9]{3})([0-9]{3})([0-9]{4})$/);

  static emailregex = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
  static phoneValidator(control: FormControl): {[key: string]: any} {

    if (ValidationService.emailregex.test(control.value)) {
      return null;
    } else {
      return {
        'invalidPhoneAddress': true,
        valid: false
      };
    }
  }
}
