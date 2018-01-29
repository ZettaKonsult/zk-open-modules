/**
 * @date  2017-12-11
 */

import { clientName, poolName } from './config';

describe('Basic tests.', () => {
  it('Client name.', () => {
    expect(clientName({ project: 'Project', customer: 'Customer' })).toEqual(
      'Project-Customer-client'
    );
  });
  it('Pool name.', () => {
    expect(poolName({ project: 'Project', customer: 'Customer' })).toEqual(
      'Project-Customer'
    );
  });
});
