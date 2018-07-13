#!/usr/bin/env bash

echo ""

cd frontend

testCommand="npm run test -- --verbose"

if eval $testCommand
then
    echo "unit tests passed"
else
    echo "unit tests failed"
    exit 1
fi
