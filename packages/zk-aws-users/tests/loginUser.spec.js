/* @flow */

/**
 * @date 2017-12-13
 *
 * Use to manually test creation of an user account.
 */

import Import from '../src';
import { TestParameters } from './testUtil';

const { Pool, Session } = Import({ config: process.env });

test('Logging in user.', async () => {
  const pool = await Pool.getId({names: {
    customer: TestParameters.CustomerName,
    project: TestParameters.ProjectName,
  }});

  await Session.login({
    pool,
    user: TestParameters.AdminUser,
    password: TestParameters.NewPassword,
  });

  await Session.signOut({ pool });
});
