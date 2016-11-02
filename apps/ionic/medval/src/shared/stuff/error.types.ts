/**
 * Created by chinmay on 10/24/16.
 */

export class ErrorType {

  public static NotLoggedIn: Error = new Error("ErrorType.NotLoggedIn");

  public static UnsupportedOperation(operation: string): Error {
    return new Error("ErrorType.UnsupportedOperation:" + operation);
  }
}
