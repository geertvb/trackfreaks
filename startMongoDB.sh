#!/bin/bash

rm -f mongo.out
rm -f mongo.err
nohup /usr/local/mongodb/bin/mongod > mongo.out 2> mongo.err < /dev/null &
echo $! > mongo.pid