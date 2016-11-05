import {Utils} from "../../shared/stuff/utils";
export class Account {

  customerId: string;
  properties : {
    customerName: string,
    logo: string
  };
  configuration?: {
    [key: string] : string
  }

  constructor() {
    this.properties = {
      customerName: "",
      logo: ''
    };
    this.configuration = {};
  }

  toString() {
    return Utils.stringify(this);
  }
}
