import csv
import random
import string


class InviteCodes(object):
    def __init__(self):
        self._invite_codes = set()

    def get(self):
        code = None
        while (code is None) or (code in self._invite_codes):
            code = ''.join(random.choice(string.ascii_lowercase) for i in range(3))
        self._invite_codes.add(code)
        return code


def main():
    guests = []
    codes = InviteCodes()

    with open('guests.csv', 'rb') as csvfile:
        creader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in creader:
            if len(row) > 5:
                guest = {'first_names': [x.strip() for x in row[0].split(',')],
                         'last_names': row[1],
                         'address_1': row[2],
                         'address_2': '',
                         'city': row[3],
                         'state': row[4],
                         'zip_code': row[5],
                         'invite_code': codes.get()}
                print guest
                guests.append(guest)


if __name__=='__main__':
    main()
