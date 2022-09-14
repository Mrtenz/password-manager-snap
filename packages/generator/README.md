# `generator`

A deterministic password generator, which derives passwords from a secret recovery phrase and a
nickname. This a port of the [C-implementation by Ledger](https://github.com/LedgerHQ/app-passwords)
to JavaScript.

This package is not published on npm, but can be used by importing it from
`@mrtenz/password-generator` inside the monorepo.

## How it works

The generator derives a password from a secret recovery phrase and a nickname. Passwords are
generated deterministically, which means that the same password is generated for the same
recovery phrase and nickname. It works as follows:

1. The nickname is hashed using SHA-256, and the SHA-256 hash is split into eight big endian 4-byte
   chunks.
2. A BIP-32 derivation path is constructed, starting with the magic value `0x80505744`, followed by
   the eight chunks from step 1.
3. A private key and chain code is derived using the BIP-32 derivation path.
4. The private key and chain code are combined to form a 64-byte seed, which is hashed using
   SHA-256, which forms entropy for a pseudorandom number generator.
5. CTR-DRBG is initialised using the SHA-256 hash from step 4.
6. Random numbers are generated using CTR-DRBG, which are used to pick characters from a character
   set.
7. The password is randomly shuffled, again using CTR-DRBG, forming the final password.
