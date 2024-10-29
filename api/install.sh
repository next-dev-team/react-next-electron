#!/bin/bash

# install virtualenv
python -m venv env

# activate virtual env
source env/Scripts/activate

# install dependencies
pip install -r requirements.txt
