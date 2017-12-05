#!/bin/bash

HOME=`dirname $(readlink -f "$0")`
TEST_SCRIPT="$HOME/test-changed.sh"

echo "Test script:"
echo "> $TEST_SCRIPT"
echo ""

$TEST_SCRIPT

exit $?
