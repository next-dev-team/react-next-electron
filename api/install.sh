#!/bin/bash

# install virtualenv
if [ ! -d "env" ]; then
    python -m venv env
fi

# activate virtual env
source env/Scripts/activate

# install dependencies
pip install -r requirements.txt
