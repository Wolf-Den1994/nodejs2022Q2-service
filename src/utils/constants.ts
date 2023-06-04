export enum InfoForUser {
  BAD_REQUEST = 'Bad request. Id is invalid (not uuid)',
  OLD_PASSWORD_WRONG = 'oldPassowrd is wrong',
  DUBLICATE_DATA = 'The passed identifier already exists',
  ADDED_SUCCESSFULY = 'Added successfully',
}

export const notFound = (type: string) =>
  `${type[0].toUpperCase() + type.slice(1)} not found`;

export const favNotFound = (type: string) =>
  `${type[0].toUpperCase() + type.slice(1)} with id doesn't exist`;
