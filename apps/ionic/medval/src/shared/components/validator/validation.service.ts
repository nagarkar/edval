export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any): string {
        let config = {
            'required': 'Required',
            'invalidPhoneAddress': 'Invalid phone number',
        };
        return config[validatorName];
    }
    static phoneValidator(control): any {
        if (control.value.match(/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/)) {
            return null;
        } else {
            return { 'invalidPhoneAddress': true };
        }
    }
}