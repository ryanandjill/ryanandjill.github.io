from flask import Flask
from flask.ext.cors import CORS
from jr_wedding_web.views import blue, api
import datastore


def create_app(cfg_module=None, cfg_overrides=None):
    app = Flask('jr_wedding_web')
#    cors = CORS(app, resources={r"/*": {"origins": "*"}}) 
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    api.init_app(app)
#    api.decorators = [cors.crossdomain(origin='*', headers=['accept', 'Content-Type'])]

    # Dynamically load configuration, with potential overrides
    load_config(app, cfg_module, cfg_overrides)

    # Dynamically create datastore object and attach it to app
    app.web_datastore = create_datastore(app)

    # import all route modules
    # and register blueprints
    app.register_blueprint(blue)
    return app, api


def load_config(app, cfg_module, cfg_overrides):
    # Load a default configuration file
    app.config.from_object('jr_wedding_web.default_settings.DevelopmentConfig')

    # Override module -- designed for use in test cases
    if cfg_module:
        app.config.from_object(cfg_module)

    # If cfg is empty try to load config file from environment variable
    app.config.from_envvar('WEB_SETTINGS', silent=True)

    # Apply overrides
    if cfg_overrides:
        app.config.update(cfg_overrides)


def create_datastore(app):
    # Discover datastore type from configuration
    ds_class = app.config.get('WEB_DATASTORE', None)
    web_ds = getattr(datastore, ds_class)()
    return web_ds
