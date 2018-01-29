/* @flow */

export const validateChangePassword = (
  oldPassword: string,
  newPassword: string,
  newPasswordConfirm: string
): boolean =>
  oldPassword.length > 0 &&
  newPassword.length > 8 &&
  newPassword === newPasswordConfirm;

export const isRequired = (input: string): boolean => input.length > 0;
