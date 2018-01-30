/* @flow */

/**
 * @date 2017-12-13
 */

import Import from '../src';
import { TestParameters } from './testUtil';

const { UserPool } = Import({ config: process.env });

test('Cleaning up after tests...', async () => {
  const names = {
    customer: TestParameters.CustomerName,
    project: TestParameters.ProjectName,
  };

  await UserPool.deleteDomain({ names });
  await UserPool.deleteUserPool({ names });
});
