import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import contractAddress from "./utils/contract-address.json";
import DecentralizedVotingSysArtifact from "./utils/DecentralizedVotingSys.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [voteOption, setVoteOption] = useState(0);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const initializeEthers = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        const tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        const tempContract = new ethers.Contract(
          contractAddress.DecentralizedVotingSys,
          DecentralizedVotingSysArtifact.abi,
          tempSigner
        );
        setContract(tempContract);

        const accounts = await tempProvider.send("eth_requestAccounts", []);
        setCurrentAccount(accounts[0]);
      } else {
        console.log("Ethereum object not found");
      }
    };

    initializeEthers();
  }, []);

  const registerVoter = async () => {
    if (contract) {
      try {
        const tx = await contract.register();
        await tx.wait();
        console.log("Voter registered");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const castVote = async () => {
    if (contract) {
      try {
        const tx = await contract.castVote(voteOption);
        await tx.wait();
        console.log("Vote casted");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchWinner = async () => {
    if (contract) {
      try {
        const winningVoteOption = await contract.getWinner();
        setWinner(winningVoteOption);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Decentralized Voting DApp</h1>
        {currentAccount ? (
          <>
            <button onClick={registerVoter}>Register as Voter</button>
            <div>
              <input
                type="number"
                value={voteOption}
                onChange={(e) => setVoteOption(Number(e.target.value))}
              />
              <button onClick={castVote}>Cast Vote</button>
            </div>
            <button onClick={fetchWinner}>Get Winner</button>
            {winner !== null && <p>Winning Option: {winner}</p>}
          </>
        ) : (
          <p>Please connect your wallet</p>
        )}
      </header>
    </div>
  );
}

export default App;
