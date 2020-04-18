#!/bin/sh -ex

[ -z "$GIT_BRANCH" ] && GIT_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
GIT_SHORT=$(git rev-parse --short HEAD)
GIT_DATE=$(git log -1 --date=iso --pretty=format:"%ad")
NOW_DATE=$(date "+%F %H:%M:%S %z")
NODE_ENV=$1

echo "{\"commit\":\"$GIT_SHORT\",\"branch\":\"$GIT_BRANCH\",\"commitAt\":\"$GIT_DATE\",\"buildAt\":\"$NOW_DATE\", \"node_env\":\"$NODE_ENV\"}" > ./build.json
