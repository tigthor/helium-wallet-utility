import { findJack } from './__fixtures__/transport';

test('getPublicKey', async () => {
  const jack = await findJack();
  expect(jack.b58).toEqual('13d52vfjmDoPufCdX1d8PmxQJW8rRqNXK3u3UsSXP5ZBaCMYzxF');
});
