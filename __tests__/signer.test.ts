import { PaymentV1 } from '@helium/transactions';
import {
  openTransportReplayer,
  RecordStore,
} from '@ledgerhq/hw-transport-mocker';
import HNT from '../src/helios-transport';
import {
  findJack, jill, txToBase64,
} from './__fixtures__/transport';

test('signTransaction to base64', async () => {
  const jack = await findJack();
  const transport = await openTransportReplayer(
    RecordStore.fromString(`
    => e00800003a0100000000000000000000000000000001000000000000000001d9b3598179022ca9922be5688cd4b0cc50512feefa2bfc831a345eda911b3c9a
    <= 3044022041673ea6da17205b9b0d279436b508cd092b686bf5b921ddf4fbf38879e4950402207510cebf32019f5d994102bfe6570bb2f5d0b931902ad6d839c5b4552a492cb99000
    `),
  );
  const hnt = new HNT(transport);
  const transaction = new PaymentV1({
    payer: jack,
    payee: jill,
    amount: 1,
    nonce: 1,
  });
  const result = await hnt.signTransaction(transaction);
  transaction.signature = result.signature;
  expect(transaction.toString()).toEqual(txToBase64);
});
