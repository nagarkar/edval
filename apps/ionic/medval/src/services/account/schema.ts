export class Account {
  customerId: string;
  properties : {
    customerName: string,
    logo: string
  };
  configuration?: {
    [key: string] : string
  }

  toString() {
    return JSON.stringify(this);
  }
}
