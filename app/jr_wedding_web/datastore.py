from pymongo import MongoClient
from bson import json_util
import json
import datetime


class MongoInvitationDAO():
    def __init__(self):
        self.client = MongoClient('localhost', 27017)
        self.db = self.client.jr_web
        self.invites = self.db.invites

    def _update_accessed_time(self, invite_id):
        self.invites.update({"invite_id": invite_id},
                            {'$push':
                                {'dates_accessed': datetime.datetime.utcnow()}})

    def invite_exists(self, invite_id):
        return self.invites.find({"invite_id": invite_id}).count() == 1

    def get_invite(self, invite_id, output_json=False):
        self._update_accessed_time(invite_id)
        out = self.invites.find_one({"invite_id": invite_id}, {'_id': 0})
        if output_json:
            out = json.dumps(out, default=json_util.default)
        return out

    def get_invites(self, output_json=False):
        out = [x for x in self.invites.find({}, {'_id': 0})]
        if output_json:
            out = json.dumps(out, default=json_util.default)
        return out

    def get_stats(self):
        # number of invites
        invite_count = self.invites.count()

        # number of people invited
        agg_stats = self.invites.aggregate([{'$group': {'_id': 'null',
                                                        'count': {'$sum': "$max_invites"},
                                                        'accepts': {'$sum': "$num_accepted"},
                                                        'regrets': {'$sum': "$num_regrets"}}}])
        responses = self.invites.find({'rsvp_complete': True}).count()
        
        invited_count = 0
        yays = 0
        nays = 0
        if len(agg_stats['result']) > 0:
            invited_count = agg_stats['result'][0]['count']
            yays = agg_stats['result'][0]['accepts']
            nays = agg_stats['result'][0]['regrets']

        # responses

        output = {'invite_count': invite_count,
                  'invited_count': invited_count,
                  'rsvp_yes': yays,
                  'rsvp_no': nays,
                  'responses': responses,
                  'no_responses': invite_count-responses,
                  'no_response_people': invited_count - (yays + nays)}

        return output

    def get_guest_count(self):
        return self.invites.count()

    def add_invite(self, invite_id, max_invites, names):
        if len(names) > max_invites:
            raise ValueError("Number of names exceeds the allowed number of invites")
        invite_data = {'invite_id': str(invite_id),
                       'names': names,
                       'max_invites': int(max_invites),
                       'rsvp_complete': False,
                       'num_accepted': 0,
                       'num_regrets': 0,
                       'rsvp_names': {x: False for x in names},
                       'dates_accessed': [],
                       'email_address': ''}
        self.invites.insert(invite_data)

    def delete_invite(self, invite_id):
        self.invites.remove({'invite_id': invite_id})

    def update_invite(self, invite_id, names, email):
        # ensure invite_id exists first
        invite = self.get_invite(invite_id)
        if len(names) > invite['max_invites']:
            raise ValueError("Number of names exceeds the allowed number of invites")
        if invite['rsvp_complete']:
            raise ValueError("RSVP already completed.")

        # update the date
        self._update_accessed_time(invite_id)

        # figure out who's coming
        yay = 0
        nay = 0
        for attending in names.itervalues():
            if attending:
                yay += 1
            else:
                nay += 1

        # update the record
        invite_data = {'$set':
                       {'rsvp_complete': True,
                        'rsvp_names': names,
                        'num_accepted': yay,
                        'num_regrets': nay,
                        'email_address': email}}
        self.invites.update({'invite_id': str(invite_id)}, invite_data)
