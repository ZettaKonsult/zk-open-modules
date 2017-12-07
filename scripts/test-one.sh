#!/bin/bash

SCRIPTS=`dirname $(readlink -f "$0")`
ROOT="$SCRIPTS/.."
TEST_DIR=$1

if [ -z "$TEST_DIR" ]; then
    echo "WARNING: no test directory specified, defaulting to ."
    TEST_DIR="."
elif [ ! -d "$TEST_DIR" ]; then
    echo "WARNING: ${TEST_DIR} is not a directory. Defaulting to ."
    TEST_DIR="."
fi

cd "$TEST_DIR"
echo "==== Testing directory '$TEST_DIR'. ===="
echo "yarn install && yarn travis:test"
yarn install && yarn travis:test
exit $?
