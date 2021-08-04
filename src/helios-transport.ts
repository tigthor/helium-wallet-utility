import { utils } from '@helium/crypto';
import { ledgerSerialize } from './utils';

/**
 * A Helium Ledger API
 *
 * @example
 * import { HNT } from "helios-transport";
 * const hnt = new HNT(transport);
 */

export default class HNT {
  private transport: any;

  constructor(transport: any, scrambleKey: string = 'HNT') {
    this.transport = transport;
    transport.decorateAppAPIMethods(
      this, ['getPublicKey', 'signTransaction'],
      scrambleKey,
    );
  }

  /**
   * get Helium publickey.
   * @option boolDisplay optionally enable or not the display
   * @return an object with publicKey, bin, and b58 address
   * @example
   * hnt.getPublicKey().then(o => o.publicKey);
   */

  getPublicKey(
    boolDisplay?: boolean,
  ): Promise<{ b58: string, publicKey: Buffer, bin: Buffer }> {
    return this.transport
      .send(0xe0, 0x02, boolDisplay ? 0x01 : 0x00, 0x00, Buffer.from([0]))
      .then((response: any) => {
        return {
          bin: response.slice(1, 34),
          publicKey: response.slice(2, 34),
          b58: utils.bs58CheckEncode(0, response.slice(1, 34)),
        };
      });
  }

  /**
   * sign a Helium transaction.
   * @param transaction protobuf to sign
   * @return an object with the signature and the status
   * @example
   * hnt.signTransaction(transaction).then(o => o.signature);
   */

  signTransaction(
    transaction: any,
  ): Promise<{ signature: Buffer }> {
    const data = ledgerSerialize(transaction);
    return this.transport
      .send(0xe0, 0x08, 0x00, 0x00, data)
      .then((response: any) => {
        const signature = response.slice(response.length - 66, response.length - 2);
        if(signature.length !== 64) throw 'User has declined.';
        return {
          signature: signature,
        };
      });
  }
}
