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

    with open('new_guests.csv', 'rb') as csvfile:
        creader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in creader:
            if len(row) > 5:
                first_names = [x.strip() for x in row[1].split(',')]
                last_names = [x.strip() for x in row[2].split(',')]
                if len(last_names) == 1:
                    display_names = [fn+" "+last_names[0] for fn in first_names]
                elif len(first_names) == len(last_names):
                    display_names = [a+" "+b for a,b in zip(first_names, last_names)]
                else:
                    print "I don't know what to do!"
                guest = {'first_names': first_names,
                         'last_names': last_names,
                         'display_names': display_names,
                         'address_1': row[5],
                         'city': row[7],
                         'state': row[8],
                         'zip_code': row[9],
                         'invite_code': row[6],
                         'num_invited': row[11]}
                print guest
                guests.append(guest)


if __name__=='__main__':
    main()
