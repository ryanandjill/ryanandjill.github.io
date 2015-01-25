import jr_wedding_web

app, api = jr_wedding_web.create_app()

if __name__ == '__main__':
    app.run(debug=True)
