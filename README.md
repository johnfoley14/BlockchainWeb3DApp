# Blockchain Webapp

## Setup and run webapp

1. Install node and npm (https://nodejs.org/en/download/package-manager)
2. Clone repo https://github.com/johnfoley14/BlockchainWeb3DApp
3. Navigate into project directory ```cd .\ticket-system-webapp\```
4. Install necessary packages ```npm i```. If you have errors installing dependencies, please refer to section at end of README.
5. Run local development environment ```npm run start```

## Note on use for demo
The following may be changed when demoing the webapp
1. Change doorman address in App.js. This will allow the user to redeem a ticket as the doorman would. This however requires the doormans private key. A doorman can be any wallet created on ```http://localhost:3000/createWallet```

## Testing using jest and truffle
Two testing frameworks are currently in use:
1. Jest for testing frontend rendering and low level logic
2. Truffle for testing the smart contract functions and testing contract deployment

Running tests:
1. To run Jest test suite: ```npm test```
2. To run Truffle smart contract tests: ```truffle test```
3. To test smart contract deployment with truffle: ```truffle develop```. This should create a local development blockchain at http://127.0.0.1:9545/. Next deploy smart contract with ````migrate --reset```

## Errors installing npm dependencies
If you are having difficulty installing dependencies or running commands, please try changing execution policy:
```Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass```

Remember to change execution policy back after:
```Set-ExecutionPolicy -Scope Process -ExecutionPolicy Default```