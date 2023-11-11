const { Web3 } = require("web3");
const contractAbi = require("../PatientRecords.json");

const web3 = new Web3("HTTP://127.0.0.1:7545");
const contractAddress = "0xa88Cc6E22dEb3380Dcf38D49071ccd0E37AD73C6";
const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);

const senderAddress = "0x7d2A3CFd66373BeD7DA1f37Df9aCdBF822330a6a";
const privateKey = "0x97018b879227f5c993440ed1d04f957a8e5aa2e7e925c2594d55b065be448c92";
const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(senderAccount);

const addPatient = (req, res) => {
  
    try{
    const patientName = req.body.patientName
    console.log(patientName)
    console.log("Received patientName")
    const dob = req.body.dob;
    const adhar = req.body.adhar;
    const gender = req.body.gender;
    const insuranceId = req.body.insuranceId;
  
    const data = [patientName, dob, adhar, gender, insuranceId];
    console.log(data)
  
    contract.methods
      .addPatient(...data)
      .send({ from: senderAccount.address, gas: 3000000})
      .on("transactionHash", (hash) => {
        console.log("Transaction Hash:", hash);
      })
      .on("receipt", (receipt) => {
        console.log("Transaction Receipt:", receipt);
      })
      .on("error", (error) => {
        console.error("Error:", error);
      });
      console.log(data)
    res.send("Added Patient✨");
    console.log("HELOOOOOOOOOWWWWWW");

    }
    catch{
        return null;
}
};

module.exports = { addPatient };
