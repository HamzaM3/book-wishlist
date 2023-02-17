from hashlib import sha256
from math import ceil
from random import randint

def h(m):
  return sha256(m).digest()

def byte_xor(a, b):
  res = []
  for x, y in zip(a,b):
    res.append(x^y)
  return bytes(res)

def randomBytes(length):
  x = randint(0, 256**length)
  x = intToBytes(x, length)
  return x

def intToBytes(n, length):
  h = hex(n)[2:]
  h = list(map(lambda x: int(x, 16), couple(h)))
  h = bytes(bytearray(h))[-length:]
  h = (b'\x00' * (length - len(h)) if length > len(h) else b'')+ h
  return h

def couple(s):
  res = []
  for i in range(len(s) % 2, len(s), 2):
    res.append(s[i: i+2])
  if len(s) % 2 == 1:
    res.insert(0, s[0])
  return res

def mgf1(seed, length):
  T = b''
  i = 0
  while len(T) < length:
    k = intToBytes(i, 4)
    T = T + h(seed+k)
    i += 1

  return T[:length]

# byte by byte operations
def oaep(message, label, keyLength, hashLength):
  label = label.encode('utf-8')
  label = h(label)
  header = '\x00'.encode('utf-8')
  message = message.encode('utf-8')

  tmp_len = len(label) + len(header) + len(message)
  num_zero = keyLength - tmp_len - hashLength - 1

  data = header + label + ((num_zero - 1) *b'\x00') + b'\x01' + message

  seed = randomBytes(hashLength)

  mask_data = mgf1(seed, len(data))

  masked_data = byte_xor(mask_data, data)

  mask_seed = mgf1(masked_data, len(seed))

  masked_seed = byte_xor(mask_seed, seed)

  res =  b'\x00' + masked_seed + masked_data
  return res


def oaep_r(crypted, hashLength):
  masked_seed = crypted[1:hashLength+1]
  masked_data = crypted[hashLength+1:]

  mask_seed = mgf1(masked_data, len(masked_seed))

  seed = byte_xor(masked_seed, mask_seed)

  mask_data = mgf1(seed, len(masked_data))

  data = byte_xor(masked_data, mask_data)
  
  data = data[hashLength+1:]
  while(data[0] != 1):
    data = data[1:]

  return data[1:]

def cut(message, keyLength, hashLength):
  block_size = keyLength - 3 - 2*hashLength
  res = []
  for i in range(0, len(message), block_size):
    res.append(message[i: i+ block_size])

  return res

def fuse(blocks):
  res = b''
  for b in blocks:
    res = res + b
  return res


if(__name__=='__main__'):
  message = "I love it"
  label= "A very efficient label! Don't hack me !!"
  padded = oaep(message, label, 128, 32)
  print(padded)
  recovered = oaep_r(padded, 32).decode('utf-8')
  print(recovered)