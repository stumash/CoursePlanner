#!/usr/bin/env bash

buildAndDeploy="./scripts/buildApp.sh $* && ./scripts/deployApp.sh $*"
if eval $buildAndDeploy
then
    echo "deploy.sh succeeded"
else
    echo "deploy.sh failed"
    exit 1
fi