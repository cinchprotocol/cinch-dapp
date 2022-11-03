// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");


module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();


  await deploy("TestToken", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    log: true,
  });
  //const tokenContract = await ethers.getContract("TestToken", deployer);

  await deploy("MarketPlace", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [deployer, 20000, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
    log: true,
  });

  await deploy("SampleProtocol", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    log: true,
  });

 await deploy("MockFeeCollector", {
    from: deployer,
    log: true,
  });

  // const marketPlaceContract = await ethers.getContract("MarketPlace", deployer);
  // await marketPlaceContract.transferOwnership('0x3CbFF2aE1581f9c2303e8e820cAFB990FC6b390F');

  // const tokenContract = await ethers.getContract("TestToken", deployer);
  // await tokenContract.transfer('0x78CaF994Ae726Dca14DC20687aAe072DcCf1996F', 5000 * (10**18));
  // await tokenContract.transfer('0xEdfdb5f2f02432F1E3271582056ECd0f884126aC', 5000 * (10**18));

  

  // const tokenContract = await ethers.getContractAt("TestToken", "0x36C02dA8a0983159322a80FFE9F24b1acfF8B570");
  // await tokenContract.faucet('0x78CaF994Ae726Dca14DC20687aAe072DcCf1996F', 5000 * 10**18);
  // await tokenContract.faucet('0xEdfdb5f2f02432F1E3271582056ECd0f884126aC', 5000 * 10**18);

  // const tokenContract = await ethers.getContractAt(
  //   "TestToken",
  //   "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  // );
  // await tokenContract.transfer(
  //   "0x78CaF994Ae726Dca14DC20687aAe072DcCf1996F",
  //   5000
  // );
  // await tokenContract.transfer(
  //   "0xEdfdb5f2f02432F1E3271582056ECd0f884126aC",
  //   5000
  // );

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
module.exports.tags = ["YourContract", "MarketPlace"];
