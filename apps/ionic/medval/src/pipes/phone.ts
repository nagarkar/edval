import {Pipe} from "@angular/core";

/**
 * Takes a phone number with 10, 11 or 12 digits and any number of spaces, dashes, + signs or brackets.
 *
 * Converts this phone number into a standard format.
 */
@Pipe({
  name: 'phoneFormat'
})
export class PhonePipe
{
  transform(tel: string, args)
  {
    if (!tel) {
      return tel;
    }
    var value = tel.toString().trim().replace(/[\+\s\(\)\[\]\-]/g, '');

    if (value.match(/[^0-9]/)) {
      return tel;
    }

    var country, city, number;

    switch (value.length) {

      case 7:
        country = 1;
        city = "";
        number = value;
        break;

      case 10: // +1PPP####### -> C (PPP) ###-####
        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);
        break;

      case 11: // +CPPP####### -> CCC (PP) ###-####
        country = value[0];
        city = value.slice(1, 4);
        number = value.slice(4);
        break;

      case 12: // +CCCPP####### -> CCC (PP) ###-####
        country = value.slice(0, 3);
        city = value.slice(3, 5);
        number = value.slice(5);
        break;

      default:
        return tel;
    }

    if (country == 1) {
      country = "";
    }

    number = number.slice(0, 3) + '-' + number.slice(3);

    if (city == "") {
      return number;
    }
    return (country + " (" + city + ") " + number).trim();
  }
}
