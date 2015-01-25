from jr_wedding_web import datastore


def main():
    dao = datastore.MongoInvitationDAO()

    # establish index
    dao.invites.ensure_index("invite_id", unique=True)
    dao.add_invite('234', 2, ['Paul DiOrio', 'Shelly DiOrio'])
    #dao.add_invite('123', 3, ['Ryan Leary', 'Jillian Winkler'])
    #dao.update_invite('123', {'Ryan Leary': True, 'Jillian Winkler': True})


if __name__ == '__main__':
    main()
