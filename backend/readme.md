# qGroup Backend

This folder houses the Flask code for the qGroup
REST API. To run, there are npm scripts provided
in the root directory.

You must have Python and Flask installed to run the server:
`pip install flask`

Use `npm run init-db` to initialize an empty database
in `/backend/instance`.

Use `npm run backend` to run the Flask server.

# qGroup REST API Docs

**This is entirely separate from the API server.
You do not need to do any of this setup if you
only need to run the API server.**

To build auto documentation, you need to have
Sphinx installed:
`pip install sphinx`

Afterwards, you can build the documentation
by using `make html` in the `docs/` folder.
If any new submodules are added, you can update
the Sphinx template by deleting `docs/flaskr.rst`
and running `sphinx-apidoc -o docs/ flaskr/`.