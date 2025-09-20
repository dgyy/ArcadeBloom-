#!/bin/bash
fileSize=$(stat -c %s dist.zip)
echo "$fileSize bytes."
