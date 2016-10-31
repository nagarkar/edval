export interface Account {
  customerId: string;
  properties : {
    customerName: string,
    logo: string
  },
  configuration?: {
    [key: string] : string
  }
}
