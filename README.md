[![Automated Markets](https://circleci.com/gh/automated-markets/bsp-protocol.svg?style=svg)](https://circleci.com/gh/automated-markets/bsp-protocol)

# BSP Protocol
A blockchain protocol for capturing, recording and sharing building safety data.

## What does BSP Protocol do?
The idea is to capture all manner of building data and associate it to individual buildings. The building data is gathered in a way that creates a tamper-resistant audit trail of building records over time, tracking who provided the information and when. The information is then shared amongst a network of organisations on a need-to-know basis.

## What type of building data is tracked?
The types of information that will be tracked are as follows:

* EWS
* EWS1
* HHSRS
* Planning data (applications and decisions)
* S106 agreements
* Section 235 notices
etc... 

## Who is this for?
Initially, the organisations that would use the BSP Protocol are Building Owners (or agents that represent them), Councils and Central Government (e.g. MHCLG).

* Building owners feed data into the system
* Councils read data about buildings within their jurisdiction
* Central Government reads data about all buildings nationally 

# Setup

1. Install Node v12.*.*
2. Install depenedencies: `npm i`
3. Create your own .env file, using the .env.template as a template:
4. Create a Pinata IPFS account and use the creds to set the PINATA_* settings in your .env file: https://pinata.cloud
5. Create new mnemonics to set the value for the ETH_KNOWN_ADDRESS_* settings in your .env file:
```bash
npx mnemonic
```

## Test

Running the tests requires two terminal windows:

```bash
// Terminal 1 - start development blockchain
npm run start:blockchain
```

```bash
// Terminal 2
$ npm test
```

# Run app
Requires two terminals - one for the local blockchain, one for the app

* Terminal 1:
```bash
npm run start:blockchain
```
* Terminal 2:
```bash
npm run start
```

Alternatively you can run the Ganache UI as your local Ethereum blockchain, so then you will only need to run the Node app:
```bash
npm run start
```
N.B. make sure the connection settings in the truffle-config.js point to your local Ganache UI blockchain, usually on port 7545 instead of 8545.

## Tech stack

### Runtime
* Enterprise Ethereum, Geth client - private, permissioned blockchain with no gas fees and no public visibility
* Solidity v0.8.3 - smart contracts
* Node v12.16.2 - to provide an API to the smart contracts
* Web3.js v1.2.9 (need to upgrade to v1.3.5) - to interact with the smart contracts and sign transactions
* Nestjs - API layer over the blockchain

### Dev deps
* Ganache - a local blockchain used for local development and testing
* Truffle - used to manage and test smart contracts

## How does it work?
TODO...

## How are the smart contracts structured?
Based on the Factory model used by Uniswap. The Factory contract is the only way to create instances of the Building contract and BuildingData contract. The Factory keeps a track of the instances of the Building and BuildingData contracts and provides utility functions to look up the contract instances by UPRN or type of BuildingData.



