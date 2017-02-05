/**
 * Created by chinmay on 10/24/16.
 */

export class ErrorType {

  public static NOT_LOGGED_IN_MSG = 'ErrorType.NotLoggedIn';

  public static throwNotLoggedIn(): void {
    throw new Error(ErrorType.NOT_LOGGED_IN_MSG);
  }

  public static UnsupportedOperation(operation: string): Error {
    return new Error("ErrorType.UnsupportedOperation:" + operation);
  }

  public static NullNotAllowed(message?: string): Error {
    return new Error("ErrorType.NullNotAllowed:" + message);
  }

  public static NullOrUndefinedNotAllowed(message?: string): Error {
    return new Error("ErrorType.NullOrUndefinedNotAllowed:" + message);
  }

  public static EntityValidationError(message?: string, ...args: string[]): Error {
    return new Error("EntityValidationError:" + message);
  }
}
