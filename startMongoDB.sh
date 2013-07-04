#!/bin/bash

rm -f mongo.out
rm -f mongo.err
nohup /usr/local/mongodb-osx-x86_64-2.4.4/bin/mongod > mongo.out 2> mongo.err < /dev/null &
echo $! > mongo.pid