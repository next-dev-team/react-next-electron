from setuptools import setup, find_packages

setup(
    name='fastapi_app',
    version='1.0',
    packages=find_packages(),
    install_requires=[
        'fastapi',
        'uvicorn',
    ],
    entry_points={
        'console_scripts': [
            'start-app=main:app'
        ],
    },
)
