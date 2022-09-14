declare module 'bcrypto/lib/ctr-drbg' {
  export default class CtrDRBG {
    constructor(
      bits: number,
      derivation: boolean,
      entropy?: Buffer,
      nonce?: Buffer,
      personal?: string
    );

    generate(size: number, add?: number): Uint8Array;
  }
}
