import jr_wedding_web

app, api = jr_wedding_web.create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)
