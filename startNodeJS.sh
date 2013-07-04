#!/bin/bash

rm -f node.out
rm -f node.err
nohup node ./server.js > node.out 2> node.err < /dev/null &
echo $! > node.pid