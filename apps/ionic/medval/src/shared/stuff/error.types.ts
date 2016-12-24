/**
 * Created by chinmay on 10/24/16.
 */

export class ErrorType {

  public static throwNotLoggedIn(): void {
    throw new Error("ErrorType.NotLoggedIn");
  }

  public static UnsupportedOperation(operation: string): Error {
    return new Error("ErrorType.UnsupportedOperation:" + operation);
  }

  public static NullNotAllowed(message?: string): Error {
    return new Error("ErrorType.NullNotAllowed:" + message);
  }
}
