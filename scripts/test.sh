#!/bin/bash

SCRIPTS=`dirname $(readlink -f "$0")`
ROOT="$SCRIPTS/.."
TEST_SCRIPT="$SCRIPTS/test-changed.sh"

echo "Test script:"
echo "> $TEST_SCRIPT"
echo ""

$TEST_SCRIPT

exit $?
