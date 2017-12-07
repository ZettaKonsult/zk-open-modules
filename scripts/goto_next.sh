#!/bin/bash

cd "`dirname $(readlink -f "$0")`/.."
ROOT="$(pwd)"
PACKAGES="$ROOT/packages"
SCRIPTS="$ROOT/scripts"
echo "Working from $ROOT."

source "$SCRIPTS/util.sh"

if [ -f "$SCRIPTS/goto_set.txt" ]; then
  read GOTO_SET < "$SCRIPTS/goto_set.txt"
  read PATHS < "$SCRIPTS/deploy_paths.txt"
  DEPLOY_PATHS=($PATHS)
fi

if [ -n "$GOTO_SET" ]; then

  if [ "$GOTO_SET" = "${#DEPLOY_PATHS[@]}" ]; then
    echo "No more paths."
    exit 1
  fi

  cd "${DEPLOY_PATHS[$GOTO_SET]}"
  echo "In `pwd`"
  N=$((GOTO_SET + 1))
  echo "$N" > "$SCRIPTS/goto_set.txt"
  exit 0
fi

echo 0 > "$SCRIPTS/goto_set.txt"

cd $PACKAGES
COMMIT=$(git rev-parse HEAD)
echo "Latest commit: $COMMIT"
FILE_LIST=$(git show --name-only --pretty=format:)
cd $ROOT

cd "$ROOT"
for FILE_PATH in $FILE_LIST; do

    MODULE_DIR="packages/$(echo "`dirname $FILE_PATH/x`" | cut -d "/" -f2)"
    if [ ! -d $MODULE_DIR ] || [ ! -f "$MODULE_DIR/package.json" ]; then
        continue
    fi

    contains "$DIRS" "$MODULE_DIR"
    if [ $? -eq 0 ]; then
      DIRS+="$MODULE_DIR "
    fi
done

echo $DIRS > "$SCRIPTS/deploy_paths.txt"
