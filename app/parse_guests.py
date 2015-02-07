import csv
import random
import string
from jr_wedding_web import datastore


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
    dao = datastore.MongoInvitationDAO()
    dao.invites.ensure_index("invite_id", unique=True)

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
                print row[11]
                guest = {'first_names': first_names,
                         'last_names': last_names,
                         'display_names': display_names,
                         'address_1': row[5],
                         'city': row[7],
                         'state': row[8],
                         'zip_code': row[9],
                         'invite_code': row[6],
                         'num_invited': row[11]}
                print 'Added ' + str(display_names) + ' to database.'
                dao.add_invite(guest['invite_code'], guest['num_invited'], display_names)


if __name__=='__main__':
    main()
