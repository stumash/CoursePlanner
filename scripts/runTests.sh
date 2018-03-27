#!/usr/bin/env bash

echo ""

testCommand="npm run test -- --verbose"

if eval $testCommand
then
    echo "unit tests passed"
else
    echo "unit tests failed"
    exit 1
fi