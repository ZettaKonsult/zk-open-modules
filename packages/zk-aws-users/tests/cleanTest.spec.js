/* @flow */

/**
 * @date 2017-12-13
 */

import Import from '../src';
import { TestParameters } from './testUtil';

const { Domain, Pool } = Import({ config: process.env });

test('Cleaning up after tests...', async () => {
  const names = {
    customer: TestParameters.CustomerName,
    project: TestParameters.ProjectName,
  };

  const pool = await Pool.getId({ names });
  const domain = await Domain.get({ pool });

  await Domain.remove({ pool, domain });
  await Pool.remove({ pool });
});
