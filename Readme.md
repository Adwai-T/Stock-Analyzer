# Stock Analyser

## Setup

### Env Variables

> Create file `.env` in project's root folder.

These are used with `dotenv` library to load enviroment variables and get them for use in scripts safely.

Port is used to start a server that listens for the browser to get the access_token when login is completed.

```env
API_KEY=without any quotes or spaces
API_SECRET=without any quotes or spaces
PORT=3000
```

### Saved Credentails

> Create file `savedcreds.json` in  project's root folder.

This files needs to be created add api_key and api_secret to it from the app created in kite connect.

When `login.mjs` is run the access_token is generated and save. This can then be used by other scripts to access the historical as well as current data from kite connect api.

```json
{"api_key":"","api_secret":"","access_token":""}
```

### Running Scripts

> All scripts are to be run from the root folder of the project

Running scripts from the root of the project gives consistency on how the files are accessed. The location used in the scripts for where it reads and writes file is relative to the root folder.

### Install Libraries

Python and nodejs are required to run the scripts present in the project.

Python is not a compulsion and can be ignored if only running the express application.

> Use npm install to install all the depencies for the app.

## Python Training

```py
# install python version less than 3.11 preferabbly 3.10.9
pip install Flask pandas numpy scikit-learn tensorflow keras
npm install # (in the node_scripts directory, if your actual scripts have dependencies)

pip uninstall tensorflow numpy pandas -y
pip cache purge

pip install tensorflow Flask pandas scikit-learn joblib

```
