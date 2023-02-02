from random import randint
from math import sqrt, floor, gcd

scale = 2**32

def testIfPrime(n):
  up = floor(sqrt(n))
  for i in range(2, up):
    if (n % i == 0):
      return False

  return True

def getNextPrime(n):
  while(not testIfPrime(n)):
    n += 2
  return n

def getACoprime(n) :
  m = 1
  while(m < scale):
    m = randint(scale**2, 2*scale**2)
    while gcd(n, m) != 1:
      m = m // gcd(n, m)
  return m

def getAModInverse(x, m):
  a = m
  av = [1, 0]
  b = x
  bv = [0, 1]
  while b != 1:
    r = a % b
    q = a // b
    rv = [av[0] - q * bv[0], av[1] - q * bv[1]]
    a = b
    b = r
    av = bv
    bv = rv

  assert(b == bv[0]*m + bv[1]*x)
  return bv[1]


def getLargePrimeNumber() :
  m = randint(scale, scale*2)
  return getNextPrime(m + (m % 2)+1)

def rsaKeyCouple():
  p = getLargePrimeNumber()
  q = getLargePrimeNumber()

  n = p * q
  phi = (p - 1) * (q - 1)

  d = getACoprime(phi)
  e = getAModInverse(d, phi) + phi

  public = [e, n]
  private = [d, n]
  
  return {'private': private, 'public': public}

def getBinaryArray(n):
  res = []
  while n != 0:
    res.append(n % 2)
    n = n // 2
  return res

def getModPower(x, p, n):
  b = getBinaryArray(p)
  res = 1
  k = x
  for p in b:
    if(p == 1):
      res = res*k % n
    k = k ** 2 % n
  return res

def encrypt(message, privatekey):
  [d, n] = privatekey

  return getModPower(message, d, n)

def decrypt(message, publickey):
  [e, n] = publickey

  return getModPower(message, e, n)

message = randint(scale /2, scale)
keys = rsaKeyCouple()
print(message)
crypted = encrypt(message, keys['private'])
print(crypted)
decry = decrypt(crypted, keys['public'])
print(decry)