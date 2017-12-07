#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Tests directories changed in the latest commit.                       #
# Parameters                                                            #
# In order to test easily, change 'git show to git ls-tree'             #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

SCRIPTS="`dirname $(readlink -f "$0")`"
ROOT="$SCRIPTS/.."
cd "$ROOT"
source "$SCRIPTS/util.sh"

echo "Working from `pwd`."
COMMIT=$(git rev-parse HEAD)
echo "Latest commit: $COMMIT"
FILE_LIST=$(git show --name-only --pretty=format:)

for FILE_PATH in $FILE_LIST; do

    MODULE_DIR="packages/$(echo "`dirname $FILE_PATH`" | cut -d "/" -f2)"

    if [ ! -d $MODULE_DIR ] || [ ! -f "$MODULE_DIR/package.json" ]; then
        continue
    fi

    contains "$DIRS" "$MODULE_DIR"
    if [ $? -eq 0 ]; then
      echo "    Module $MODULE_DIR was changed."
      DIRS+="$MODULE_DIR "
    fi
done

echo "Changed modules:"
for DIR in $DIRS; do
    echo "> `basename $DIR`"
done
echo ""

for DIR in $DIRS; do
    $SCRIPTS/test-one.sh $DIR

    rc=$?
    if [ $rc != 0 ]; then
        echo "Test failed with exit code $rc."
        exit $rc
    fi
done

exit 0
