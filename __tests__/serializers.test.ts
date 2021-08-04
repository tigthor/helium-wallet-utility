import { PaymentV1 } from '@helium/transactions';
import { bnSerialize, ledgerSerialize } from '../src/utils';
import {
  findJack, jill, quadrillionBones, ledgerHex,
} from './__fixtures__/transport';

test('bnSerialize', async () => {
  const oneQuadrillionBones = bnSerialize(quadrillionBones).toString('hex');
  expect(oneQuadrillionBones).toEqual('0080c6a47e8d0300');
});

test('ledgerSerialize', async () => {
  const jack = await findJack();
  const transaction = new PaymentV1({
    payer: jack,
    payee: jill,
    amount: quadrillionBones,
    nonce: 1,
  });
  const serialized = ledgerSerialize(transaction);
  const result = serialized.toString('hex');
  expect(result).toEqual(ledgerHex);
});
