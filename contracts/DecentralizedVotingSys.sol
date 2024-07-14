// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVotingSys {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint vote;
    }

    address public owner;
    mapping(address => Voter) public voters;
    mapping(address => bool) public blacklisted;
    uint public registrationDeadline; //Unix timestamp for the registration deadline
    // To calculate the Unix timestamp for a specific date, used
    //   https://www.epochconverter.com/.  The timestamp for July 14, 2024, 23:59  is 1721001556
     
    mapping(uint => uint) public votes; // mapping to track votes for each option
    uint public voteOptionsCount;

    event VoterRegistered(address voter);
    event VoteCasted(address voter, uint vote);
    event VoterBlacklisted(address voter);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < registrationDeadline, "Registration period is over");
        _;
    }

    modifier isRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "Voter is not registered");
        _;
    }

    constructor(uint _registrationDeadline, uint _voteOptionsCount) {
        owner = msg.sender;
        registrationDeadline = _registrationDeadline;
        voteOptionsCount = _voteOptionsCount;
    }

    function register() external beforeDeadline {
        require(!voters[msg.sender].isRegistered, "Voter is already registered");
        voters[msg.sender].isRegistered = true;
        emit VoterRegistered(msg.sender);
    }

    function castVote(uint _vote) external isRegisteredVoter {
        require(_vote < voteOptionsCount, "Invalid vote option");
        require(!blacklisted[msg.sender], "Voter is blacklisted");
        if (voters[msg.sender].hasVoted) {
            // Voter tries to vote again
            votes[voters[msg.sender].vote] -= 1; // Remove already casted vote too
            blacklisted[msg.sender] = true; // Blacklist voter
            emit VoterBlacklisted(msg.sender);
        } else {
            voters[msg.sender].hasVoted = true;
            voters[msg.sender].vote = _vote;
            votes[_vote] += 1;
            emit VoteCasted(msg.sender, _vote);
        }
    }

    function getVoteCount(uint _vote) external view returns (uint) {
        require(_vote < voteOptionsCount, "Invalid vote option");
        return votes[_vote];
    }

    function isBlacklisted(address _voter) external view returns (bool) {
        return blacklisted[_voter];
    }

    function getWinner() external view returns (uint winningVoteOption) {
        uint winningVoteCount = 0;
        for (uint i = 0; i < voteOptionsCount; i++) {
            if (votes[i] > winningVoteCount) {
                winningVoteCount = votes[i];
                winningVoteOption = i;
            }
        }
    }
}
