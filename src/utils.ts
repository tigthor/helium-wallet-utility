import BigInt from 'big-integer';

export const bnSerialize = (amount: number): Buffer => {
  let hex = BigInt(amount).toString(16);
  hex = hex.length % 2 ? `0${hex}` : hex;
  const len = Math.floor(hex.length / 2);
  if (len > 8) throw 'Invalid transaction.';
  const u8 = new Uint8Array(8);
  for (let i = 0; i < len; i += 1) u8[len - i - 1] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return Buffer.from(u8);
};

export const ledgerSerialize = (transaction: any): Buffer => {
  const txSerialized = Buffer.concat([
    bnSerialize(transaction.amount),
    bnSerialize(transaction.fee),
    bnSerialize(transaction.nonce),
    Buffer.from([transaction.payee.version]),
    Buffer.from([transaction.payee.keyType]),
    Buffer.from(transaction.payee.publicKey),
  ]);
  return Buffer.from(txSerialized);
};

