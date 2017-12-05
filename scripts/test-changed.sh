#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Tests directories changed in the latest commit.                       #
# Parameters                                                            #                                             #
#                                                                       #
# In order to test easily, change 'git diff-tree to git ls-tree'        #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

cd "`dirname $(readlink -f "$0")`/.."
ROOT="$(pwd)"
SCRIPTS="$ROOT/scripts"

COMMIT=$(git rev-parse HEAD)
echo "Latest commit: ${COMMIT}"

FILE_LIST=$(git show --name-only --pretty=format:)

for FILE_PATH in $FILE_LIST; do

    MODULE_DIR="packages/$(echo "`dirname $FILE_PATH`" | cut -d "/" -f2)"

    if [ ! -d $MODULE_DIR ] || [ ! -f "$MODULE_DIR/package.json" ]; then
        continue
    fi

    DIRS+="$MODULE_DIR "
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
