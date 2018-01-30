/* @flow */

/**
 * @date 2017-12-13
 *
 * Use to manually test creation of an user account.
 */

import Import from '../src';
import { TestParameters } from './testUtil';

const { Account } = Import({ config: process.env });

test('Logging in user.', async () => {
  const pool = {
    customer: TestParameters.CustomerName,
    project: TestParameters.ProjectName,
  };

  await Account.signOutUser({ names: pool });

  await Account.loginUser({
    names: pool,
    userName: TestParameters.AdminUser,
    password: TestParameters.NewPassword,
  });

  await Account.signOutUser({ names: pool });
});
