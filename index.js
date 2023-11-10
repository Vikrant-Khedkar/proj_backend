const express = require("express");
const bodyParser = require("body-parser");
// const fileUpload = require('express-fileupload');
const fs = require("fs");
const cors = require("cors");
const axios = require("axios");
const ipfsAPI = require("ipfs-api");
const { Web3 } = require("web3");
const ipfs = ipfsAPI("/ip4/127.0.0.1/tcp/5001");
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload());
// let corsoptions = {
//   origin:['http:localhost:3000'],
// }
app.use(cors());

app.get("/", (req, res) => {
  res.send("DHARTI🌏");
});

// Connect with the Ganache Blockchain Network
const web3 = new Web3("http://localhost:7545");
//Get the ABI of the Contract which contains the methods and structures of the contract
const contractAbi = require("./PatientRecords.json");
//Address of the contract on blockchain
const contractAddress = "0x1480cfd2112D5894352C10223365FeA94Fbc9062";
//create a contract instance
const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);

//Address of the Sender from the Ganache Generated Accounts
const senderAddress = "0x7d2A3CFd66373BeD7DA1f37Df9aCdBF822330a6a";
//Private Key of that account
const privateKey =
  "0x97018b879227f5c993440ed1d04f957a8e5aa2e7e925c2594d55b065be448c92";
//Create account from the Address and PrivateKey
const senderAccount = web3.eth.accounts.privateKeyToAccount(
  privateKey,
  senderAddress
);
//Add account to the wallet
web3.eth.accounts.wallet.add(senderAccount);

app.post("/addPatient", (req, res) => {
  const patientName = req.body.patientName;
  const dob = req.body.dob;
  const adhar = req.body.adhar;
  const gender = req.body.gender;
  const insuranceId = req.body.insuranceId;

  contract.methods
    .addPatient(patientName, dob, adhar, gender, insuranceId)
    .send({ from: senderAccount.address, gas: 2000000 })
    .on("transactionHash", (hash) => {
      console.log("Transaction Hash:", hash);
    })
    .on("receipt", (receipt) => {
      console.log("Transaction Receipt:", receipt);
    })
    .on("error", (error) => {
      console.error("Error:", error);
    });
  res.send("Added Patient✨");
});

//Api to upload files to IPFS
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    const fileName = "demo";
    const fileStream = fs.createReadStream(file.path);

    const fileAdded = await new Promise((resolve, reject) => {
      const ipfsFileObj = {
        path: fileName,
        content: fileStream,
      };

      ipfs.add(ipfsFileObj, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    fs.unlink(file.path, (err) => {
      if (err) console.log(err);
    });

    const fileHash = fileAdded[0].hash;
    const url = `ipfs://${fileHash}`;
    res.send({ url, fileName, fileHash });
    console.log(url, fileName, fileHash);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
