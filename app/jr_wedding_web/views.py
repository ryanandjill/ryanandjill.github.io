from flask import Blueprint, current_app, request
from flask_restful import abort, Resource, reqparse, Api

api = Api()
blue = Blueprint('main', __name__, None)


@blue.route('/')
def index():
    conf_app_name = current_app.config.get('WEB_APP_NAME',
                                           'Jill & Ryan Web RSVP')
    return conf_app_name


def abort_if_invite_doesnt_exist(dao, invite_id):
    if not dao.invite_exists(invite_id):
        abort(404, message="Invite {} doesn't exist".format(invite_id))


# Todo
#   show a single todo item and lets you delete them
class Invitation(Resource):
    @staticmethod
    def get(invitation_id):
        dao = current_app.web_datastore
        abort_if_invite_doesnt_exist(dao, invitation_id)
        return dao.get_invite(invitation_id, output_json=True)

    @staticmethod
    def delete(invitation_id):
        dao = current_app.web_datastore
        abort_if_invite_doesnt_exist(dao, invitation_id)
        dao.delete_invite(invitation_id)
        return '', 204

    # expect a put to include:
    # {names: [{name: 'Ryan Leary', attending: True},
    #          {name: 'Jill Winkler', attending: True}],
    #  email: 'ryanl.jillw@gmail.com'}
    def put(self, invitation_id):
        dao = current_app.web_datastore
        data = request.get_json()
        if dao.invite_exists(invitation_id):
            dao.update_invite(invitation_id, data['names'], data['email'])
            return dao.get_invite(invitation_id, output_json=True), 201
        return 'Invitation does not exist.', 404


# TodoList
#   shows a list of all todos, and lets you POST to add new tasks
class InvitationList(Resource):
    @staticmethod
    def get():
        dao = current_app.web_datastore
        return dao.get_invites(output_json=True)


class InvitationStats(Resource):
    @staticmethod
    def get():
        dao = current_app.web_datastore
        return dao.get_stats()


# Actually setup the Api resource routing here
api.add_resource(InvitationStats, '/stats')
api.add_resource(InvitationList, '/invitations')
api.add_resource(Invitation, '/invitation/<string:invitation_id>')
