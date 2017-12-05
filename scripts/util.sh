#!/bin/bash

contains() {
    if [[ $1 =~ (^|[[:space:]])$2($|[[:space:]]) ]]; then
      return 1
    fi
    return 0
}
