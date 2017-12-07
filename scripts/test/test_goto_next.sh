#!/bin/bash

HOME=`dirname $(readlink -f "$0")`
cd "$HOME/.."

./goto_next.sh

rm -f "1"
rm -f "deploy_paths.txt"
rm -f "goto_set.txt"
