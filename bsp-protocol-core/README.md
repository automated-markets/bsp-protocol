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
Initially, the organisations that would use the BSP Protocol are Building Owners (or agents that represent them), Councils and Central Government (via MHCLG).

* Building owners feed data into the system
* Councils reads data about buildings within their jurisdiction
* Central Government reads data about all buildings nationally 

# Setup

1. Install Node v12.*.*
2. Install depenedencies: `npm i`
3. Run tests: `npm test`

## Tech stack

### Runtime
* Enterprise Ethereum, Geth client - private, permissioned blockchain with no gas fees and no public visibility
* Solidity v0.8.3 - smart contracts
* Node v12.16.2 - to provide an API to the smart contracts
* Web3.js v1.2.9 (need to upgrade to v1.3.5) - to interact with the smart contracts and sign transactions

### Dev deps
* Ganache - a local blockchain used for local development and testing
* Truffle - used to manage and test smart contracts

## How does it work?
TODO...

## How are the smart contracts structured?
Based on the Factory model used by Uniswap. The Factory contract is the only way to create instances of the Building contract and BuildingData contract. The Factory keeps a track of the instances of the Building and BuildingData contracts and provides utility functions to look up the contract instances by UPRN or type of BuildingData.



