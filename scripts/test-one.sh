#!/bin/bash

HOME=`dirname $(readlink -f "$0")`
TEST_DIR=$1

if [ -z "$TEST_DIR" ]; then
    TEST_DIR="."
elif [ ! -d "$TEST_DIR" ]; then
    echo "${TEST_DIR} is not a directory. Defaulting to ."
    TEST_DIR="."
fi

cd "$TEST_DIR"
echo "==== Testing directory '$TEST_DIR'. ===="
yarn install
yarn travis:test
exit $?
