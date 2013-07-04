#!/bin/bash

kill -9 `cat mongo.pid`
rm -f mongo.pid