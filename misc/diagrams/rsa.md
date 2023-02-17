# RSA v2.2 notes

## Keys generation

1. pick two prime numbers p and q
2. let n = pq and m = (p-1)(q-1)
3. let e be a number coprime with m
4. let d be the inverse of e mod m

the public key is [e, n]
the private key is [d, n]
(or the reverse if you noticed)

## RSA encryption/decryption primitive

1. generate your key pair
2. publish your public key

### Encryption

3. your friend grabs the public key [e, n]
4. your friend translates his message into a number M mod n
5. your friend sends you M^e mod n

### Decryption

6. you receive N = M^e mod n
7. you calculate M = N^d mod n
8. you translate the number M into the original message (using a predefined procedure)

## Translation from string to number

Easy: concatenate the byte representation of your string.
Of course, cut it into pieces smaller than n. (in a certain way)

The reverse is obvious.

## Padding

To protect ourselves from a chosen-plaintext attack, we have to add a bit of randomness through the padding

_Padding:_ adding values to reach a certain desired length

Everything is considered in base 256
