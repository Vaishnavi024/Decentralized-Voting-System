import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import './App.css';
import contractAddress from './utils/contract-address.json';
import DecentralizedVotingSysArtifact from './utils/DecentralizedVotingSys.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [voteOption, setVoteOption] = useState(0);
  const [winner, setWinner] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [message, setMessage] = useState('');
  const [voteCounts, setVoteCounts] = useState([]);

  useEffect(() => {
    const initializeEthers = async () => {
      if (window.ethereum) {
        const tempProvider = new BrowserProvider(window.ethereum);
        setProvider(tempProvider);

        const tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);

        const tempContract = new Contract(
          contractAddress.DecentralizedVotingSys,
          DecentralizedVotingSysArtifact.abi,
          tempSigner
        );
        setContract(tempContract);

        const accounts = await tempProvider.send('eth_requestAccounts', []);
        setCurrentAccount(accounts[0]);

        const voter = await tempContract.voters(accounts[0]);
        setIsRegistered(voter.isRegistered);
        setIsBlacklisted(voter.isBlacklisted);
      } else {
        console.log('Ethereum object not found');
      }
    };

    initializeEthers();
  }, []);

  const registerVoter = async () => {
    if (contract) {
      try {
        const tx = await contract.register();
        await tx.wait();
        setMessage('Voter registered successfully');
        setIsRegistered(true);
      } catch (error) {
        console.error(error);
        setMessage('Error registering voter');
      }
    }
  };

  const castVote = async () => {
    if (!isRegistered) {
      setMessage('Error: You must be registered to vote.');
      return;
    }
    if (contract) {
      try {
        const tx = await contract.castVote(voteOption);
        await tx.wait();
        setMessage('Vote casted successfully. You can vote only once.');
      } catch (error) {
        console.error(error);
        if (error.message.includes("Voter is blacklisted")) {
          setMessage('Error: You are blacklisted and your previous vote has been removed.');
          setIsBlacklisted(true);
        } else {
          setMessage('Error casting vote');
        }
      }
    }
  };

  const fetchWinner = async () => {
    if (contract) {
      try {
        const currentTime = Math.floor(Date.now() / 1000);
        const deadline = await contract.registrationDeadline();
        if (currentTime < deadline) {
          setMessage('Voting is still in process.');
          return;
        }
        const winningVoteOption = await contract.getWinner();
        setWinner(winningVoteOption);
      } catch (error) {
        console.error(error);
        setMessage('Error fetching winner');
      }
    }
  };

  const fetchVoteCounts = async () => {
    if (contract) {
      try {
        const voteOptionsCount = await contract.voteOptionsCount();
        const counts = [];
        for (let i = 0; i < voteOptionsCount; i++) {
          const count = await contract.getVoteCount(i);
          counts.push(count.toString()); // Convert BigNumber to string
        }
        setVoteCounts(counts);
        console.log("Vote counts:", counts); // Log counts for debugging
      } catch (error) {
        console.error(error);
        setMessage('Error fetching vote counts');
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Decentralized Voting DApp</h1>
        {currentAccount ? (
          <>
            <p>Connected Account: {currentAccount}</p>
            {isBlacklisted ? (
              <p className="error">You are blacklisted and cannot vote</p>
            ) : (
              <>
                {isRegistered ? (
                  <p>You are registered to vote</p>
                ) : (
                  <button onClick={registerVoter} className="button">Register as Voter</button>
                )}
                <div className="vote-section">
                  <input
                    type="number"
                    value={voteOption}
                    onChange={(e) => setVoteOption(Number(e.target.value))}
                    className="input"
                  />
                  <button onClick={castVote} className="button">Cast Vote</button>
                </div>
                <button onClick={fetchWinner} className="button">Get Winner</button>
                {winner !== null && <p>Winning Option: {winner}</p>}
                <button onClick={fetchVoteCounts} className="button">Get Vote Counts</button>
                {voteCounts.length > 0 && (
                  <div className="vote-counts">
                    {voteCounts.map((count, index) => (
                      <p key={index}>Option {index}: {count} votes</p>
                    ))}
                  </div>
                )}
              </>
            )}
            {message && <p className="message">{message}</p>}
          </>
        ) : (
          <p>Please connect your wallet</p>
        )}
      </header>
    </div>
  );
}

export default App;
