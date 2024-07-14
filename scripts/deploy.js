const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const DecentralizedVotingSys = await ethers.getContractFactory("DecentralizedVotingSys");
  const registrationDeadline = 1728969599; // Replace with the actual timestamp
  const voteOptionsCount = 3; // Number of voting options
  const votingSys = await DecentralizedVotingSys.deploy(registrationDeadline, voteOptionsCount);

  console.log("DecentralizedVotingSys deployed to:", votingSys.address);

  // Save contract address and ABI to a file
  const contractsDir = path.join(__dirname, "../frontend/src/utils");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ DecentralizedVotingSys: votingSys.address }, undefined, 2)
  );

  const DecentralizedVotingSysArtifact = artifacts.readArtifactSync("DecentralizedVotingSys");

  fs.writeFileSync(
    path.join(contractsDir, "DecentralizedVotingSys.json"),
    JSON.stringify(DecentralizedVotingSysArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
