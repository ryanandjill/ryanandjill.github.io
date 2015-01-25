import string
import random

print(''.join(random.choice(string.ascii_lowercase) for i in range(3)))
