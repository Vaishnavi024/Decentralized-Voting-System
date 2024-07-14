# Decentralized-Voting-System

## Description

The Decentralized Voting DApp is a blockchain-based application that allows users to register, vote, and view voting results in a decentralized and secure manner. This project includes both a smart contract deployed on the Sepolia testnet and a React front-end for interacting with the contract.

## Demo Videos

* **Remix IDE Demo**: [Watch Demo]
  (https://link-to-your-remix-demo-video)
* **Deployed DApp Demo**: [Watch Demo](https://link-to-your-deployed-dapp-demo-video)

## Features

### Smart Contract

1. **Registration**: Users can register to vote before a specified deadline.
2. **Voting**: Registered users can cast their vote. If a user attempts to vote more than once, their previous vote is removed, and they are blacklisted.
3. **Winner Calculation**: The contract can calculate the winning vote option after the voting deadline.
4. **Vote Count**: The contract can provide the count of votes for each option.
5. **Blacklist Check**: The contract can check if a user is blacklisted.

### Front-End DApp

1. **Connect Wallet**: Connect to the Ethereum wallet using MetaMask.
2. **Register as Voter**: Register to vote if not already registered.
3. **Cast Vote**: Cast a vote for a specified option.
4. **Get Winner**: Fetch the winning vote option (only after the voting deadline).
5. **Get Vote Counts**: Fetch and display the vote counts for each option.

## How to Get Timestamp

To get a Unix timestamp for a specific date, use [Epoch Converter](https://www.epochconverter.com/):

1. Go to the Epoch Converter website.
2. Enter the desired date and time in the provided fields.
3. Copy the generated Unix timestamp and use it in your smart contract.

![image](https://github.com/user-attachments/assets/434f6394-0c3a-480d-9687-6ad710b3770b)
For example, the timestamp for July 14, 2024, 23:59 is `1721001599`.

## Important Files and Directories

* `contracts/DecentralizedVotingSys.sol`: Contains the smart contract code for the voting system.
* `scripts/deploy.js`: Script used for deploying the contract to the Ethereum network.
* `frontend/src/App.js`: Main React component that interfaces with the smart contract.
* `frontend/src/App.css`: Styling for the React application.
* `frontend/src/utils/contract-address.json`: Contains the deployed contract address.
* `frontend/src/utils/DecentralizedVotingSys.json`: Contains the ABI of the deployed contract.

## Conclusion

Thank you for visiting the Decentralized Voting DApp repository.

