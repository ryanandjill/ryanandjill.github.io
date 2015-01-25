class Config(object):
    DEBUG = False
    TESTING = False
    WEB_DATASTORE = 'MongoInvitationDAO'


class ProductionConfig(Config):
    WEB_DATASTORE = 'TodoDAO2'


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
