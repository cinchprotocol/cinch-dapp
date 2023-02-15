const { ethers, upgrades } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const mockERC20 = await deploy("MockERC20", {
    from: deployer,
    log: true,
  });

  const mockProtocol = await deploy("MockProtocol", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    log: true,
    args: [mockERC20.address],
  });

  const mockGnosisSafe = await deploy("MockGnosisSafe", {
    from: deployer,
    log: true,
  });

  const cinchSafeGuard = await deploy("CinchSafeGuard", {
    from: deployer,
    log: true,
  });

  const mockGnosisSafeContract = await ethers.getContractAt(
    "MockGnosisSafe",
    mockGnosisSafe.address
  );
  // await marketPlaceContract.transferOwnership('0x3CbFF2aE1581f9c2303e8e820cAFB990FC6b390F');
  await mockGnosisSafeContract.setGuard(cinchSafeGuard.address);

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await upgrades.deployProxy(
    Vault,
    [
      mockERC20.address,
      "CinchPx",
      "CPxMock",
      mockProtocol.address,
      mockGnosisSafe.address,
      cinchSafeGuard.address,
    ],
    {
      from: deployer,
      log: true,
      initializer: "initialize",
    }
  );
  await vault.deployed();
  await vault.activateBypass();
  console.log("Vault deployed to:", vault.address);

  /*
  const sampleProtocolContract = await ethers.getContractAt(
    "SampleProtocol",
    mockProtocol.address
  );
  await sampleProtocolContract.transferOwnership(mockGnosisSafe.address);

  await sampleProtocolContract.setFeeReceiver(vault.address);
  */

  // await deploy("MarketPlace", {
  //   // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
  //   from: deployer,
  //   args: [deployer, 20000, "0x5FbDB2315678afecb367f032d93F642f64180aa3"],
  //   log: true,
  // });

  // await deploy("MockCinchPx", {
  //   from: deployer,
  //   log: true,
  // });

  // const marketPlaceContract = await ethers.getContract("MarketPlace", deployer);
  // await marketPlaceContract.transferOwnership('0x3CbFF2aE1581f9c2303e8e820cAFB990FC6b390F');

  // const tokenContract = await ethers.getContractAt("TestToken", "0x36C02dA8a0983159322a80FFE9F24b1acfF8B570");
  // await tokenContract.faucet('0x78CaF994Ae726Dca14DC20687aAe072DcCf1996F', 5000 * 10**18);

  /*
    // Getting a previously deployed contract
    const YourContract = await ethers.getContract("YourContract", deployer);
    await YourContract.setPurpose("Hello");
  
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
};
module.exports.tags = ["YourContract", "MarketPlace", "Vault"];
