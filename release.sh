#!/bin/bash

commit=$(git rev-parse --short HEAD)

search_pattern="v=[0-9a-f]{7}"

sed -r -i '' "s/$search_pattern/v=$commit/g" index.html
