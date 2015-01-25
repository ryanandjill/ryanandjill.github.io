from setuptools import setup, find_packages

setup(
    name='jr_wedding_web',
    version='0.1',
    packages=find_packages(exclude=['tests']),
    test_suite="tests",
    install_requires=['Flask', 'Flask-Testing', 'Flask-RESTful', 'pymongo']
)
