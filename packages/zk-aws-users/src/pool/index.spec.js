/**
 * @date  2017-12-11
 */

import { clientName, poolName } from './config';

describe('Basic tests.', () => {
  it('Client name.', () => {
    expect(
      clientName({ names: { project: 'Project', customer: 'Customer' } })
    ).toEqual('Project-Customer-client');
  });
  it('Pool name.', () => {
    expect(
      poolName({ names: { project: 'Project', customer: 'Customer' } })
    ).toEqual('Project-Customer');
  });
});
