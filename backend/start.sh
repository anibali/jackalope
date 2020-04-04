#!/bin/bash -e

# Start the server
if [ "$NODE_ENV" == "production" ]
then
  node lib/entryPoint.js "$@"
else
  node --require="@babel/register" src/entryPoint.js "$@"
fi
