#!/usr/bin/env bash

# From: https://gist.github.com/hellwolf/473d598b7963079e32af98ab168bc78a
# Notes:
#  - Shchema: https://github.com/trufflesuite/truffle/tree/develop/packages/truffle-contract-schema
#  - bytecode vs deployedBytecode: https://ethereum.stackexchange.com/questions/32234/difference-between-bytecode-and-runtime-bytecode

#nvm use 14.16.0
jq 'del(.ast,.legacyAST,.source,.deployedSourceMap,.userdoc,.devdoc,.sourcePath,.metadata)' ../build/contracts/Agreement.json > src/contracts/Agreement.json
#build here
#ipfs add -r dist
