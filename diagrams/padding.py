from hashlib import sha256
from math import ceil
from random import randint

def h(m):
  return sha256(m).digest()
h_len = 32

def intToBytes(n, length):
  h = hex(n)[2:]
  h = list(map(lambda x: int(x, 16), couple(h)))
  h = bytes(bytearray(h))[-length:]
  h = b'\x00' * (length - len(h)) + h
  return h

def couple(s):
  res = []
  for i in range(0, len(s), 2):
    res.append(s[i: i+2])
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

  tmp_len = len(label) + 1 + len(message)
  num_zero = keyLength - tmp_len - hashLength - 1

  data = header + label + ((num_zero - 1) *b'\x00') + b'\x01' + message

  seed = randomBytes(hashLength)

  mask_data = mgf1(seed, len(data))

  masked_data = byte_xor(mask_data, data)

  mask_seed = mgf1(masked_data, len(seed))

  masked_seed = byte_xor(mask_seed, seed)

  return b'\x00' + masked_seed + masked_data


def oaep_r(crypted, hashLength):
  masked_seed = crypted[1:33]
  masked_data = crypted[33:]

  mask_seed = mgf1(masked_data, len(masked_seed))

  seed = byte_xor(masked_seed, mask_seed)

  mask_data = mgf1(seed, len(masked_data))

  data = byte_xor(masked_data, mask_data)
  print(data)
  data = data[33:]
  print(type(data[0]))
  while(data[0] != 1):
    data = data[1:]

  return data[1:]


def byte_xor(a, b):
  res = []
  for x, y in zip(a,b):
    res.append(x^y)
  return bytes(res)


def randomBytes(length):
  x = randint(0, 256**length)
  x = intToBytes(x, length)
  return x

message = "I love knowing"
label= "A very efficient label! Don't hack me !!"
padded = oaep(message, label, 128, 32)
recovered = oaep_r(padded, label).decode('utf-8')
print(recovered)