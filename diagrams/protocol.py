from rsa import rsaKeyCoupleLib, encrypt, decrypt, getModPower
from padding import oaep, oaep_r, cut, fuse, intToBytes

def block_encrypt(block, public_key):
  m = oaep(block, 'label', 256, 32)
  m = int.from_bytes(m, "big")
  return encrypt(m, public_key)

def block_decrypt(block, private_key):
  m = decrypt(block, private_key)
  m = intToBytes(m, 256)
  return oaep_r(m, 32)


def true_encrypt(message, public_key):
  blocks = cut(message, 256, 32)
  f = lambda b : block_encrypt(b, public_key)
  return list(map(f, blocks))


def true_decrypt(blocks, private_key):
  f = lambda b : block_decrypt(b, private_key)
  blocks = list(map(f, blocks))
  return fuse(blocks)

octet = 256
x = rsaKeyCoupleLib(octet*8)
private = x['private']
public = x['public']

message = 'anymessage'*64
encrypted = true_encrypt(message, public)

post_encrypt = ''.join(list(map(hex, encrypted)))

pre_decrypt =list(map(lambda x: int(x, 16), post_encrypt.split('0x')[1:]))

decrypted = true_decrypt(pre_decrypt, private)

if(message == decrypted.decode('utf-8')):
  print('success')
else:
  print('go back to debugging')
  