/* @flow */

/**
 * @date 2017-12-12
 */

import Import from '../src';
import { TestParameters } from './testUtil';

const { UserPool } = Import({ config: process.env });

test('Creating pool.', async () => {
  await UserPool.createUserPool({
    names: {
      customer: `${TestParameters.CustomerName}`,
      project: `${TestParameters.ProjectName}`,
    },
    replyEmail: TestParameters.Email,
    adminAttributes: {
      family_name: TestParameters.FamilyName,
      given_name: TestParameters.GivenName,
      birthdate: TestParameters.SSN,
      email: TestParameters.Email,
    },
  });
});
