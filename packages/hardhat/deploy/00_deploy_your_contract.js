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

  const protocolPayee = "0x683c5FEb93Dfe9f940fF966a264CBD0b59233cd2";
  const cinchVaultPayee = "0xdfFFAC7E0418A115CFe41d80149C620bD0749628";
  const FeeSplitter = await ethers.getContractFactory("FeeSplitter");
  const feeSplitter = await upgrades.deployProxy(
    FeeSplitter,
    [vault.address, [mockERC20.address], protocolPayee, [cinchVaultPayee]],
    {
      from: deployer,
      log: true,
      initializer: "initialize",
    }
  );
  await feeSplitter.deployed();
  console.log("FeeSplitter deployed to:", feeSplitter.address);

  await vault.setFeeSplitter(feeSplitter.address);

  const mockProtocolContract = await ethers.getContractAt(
    "MockProtocol",
    mockProtocol.address
  );
  await mockProtocolContract.setFeeReceiver(feeSplitter.address);

  // deposit initial TVL (non-referral) to protocol
  const mockERC20Contract = await ethers.getContractAt(
    "MockERC20",
    mockERC20.address
  );
  const mockERC20Decimals = 6;
  const initProtocolTVLAmount = ethers.utils.parseUnits(
    "1000",
    mockERC20Decimals
  );
  await mockERC20Contract.faucet(deployer, initProtocolTVLAmount);
  await mockERC20Contract.approve(vault.address, initProtocolTVLAmount);
  await vault.deposit(initProtocolTVLAmount, deployer);
  console.log("deposited initial TVL to protocol", initProtocolTVLAmount);

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
