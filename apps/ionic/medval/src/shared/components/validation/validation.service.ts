/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {ValidatorFn, Validators} from "@angular/forms";
export class ValidationService {

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any): string {
    let config = {
      'required': 'Required',
      'invalidPhoneAddress': 'Invalid phone number',
    };
    return config[validatorName];
  }

  static emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static phoneRegEx = /^(\([0-9]{3}\)\s)?[0-9]{3}\-[0-9]{4}$/;
  static urlValidator = /[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/i;
  static EmailValidator: ValidatorFn = Validators.pattern(ValidationService.emailRegEx);
  static PhoneValidator: ValidatorFn = Validators.pattern(ValidationService.phoneRegEx);
  static singleWordIdIndex = /[\S]+/;

  static validSingleWordId(id: string) {
    return ValidationService.valid(id, /[\S]+/);
  }

  static validEmail(email: string) {
    return ValidationService.valid(email, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }

  static valid(id: string, regex) {
    if (!id) {
      return false;
    }
    let result = regex.exec(id.toLowerCase());
    if (result && result[0]) {
      return result[0].length == id.length;
    }
    return false;
  }
}
