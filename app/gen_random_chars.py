import string
import random


def get_rnd_str():
    return ''.join(random.choice(string.ascii_lowercase) for i in range(3))

chars = set()
for i in xrange(100):
    x = get_rnd_str()
    if x not in chars:
        chars.add(x)

for char in chars:
    print char
