const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const ipfsAPI = require('ipfs-api');
const {Web3} = require('web3');
const ipfs = ipfsAPI("/ip4/127.0.0.1/tcp/5001");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('HI OM');
});

// Connect with the Ganache Blockchain Network
const web3 = new Web3('http://localhost:7545');
//Get the ABI of the Contract which contains the methods and structures of the contract
const contractAbi =  require('./PatientRecords.json');
//Address of the contract on blockchain
const contractAddress = '0x0a4CC4496C694c56B180860594d7EBD33fe1b502';
//create a contract instance
const contract = new web3.eth.Contract(contractAbi.abi,contractAddress);

//Address of the Sender from the Ganache Generated Accounts
const senderAddress = '0x7d2A3CFd66373BeD7DA1f37Df9aCdBF822330a6a';
//Private Key of that account
const privateKey = '0x97018b879227f5c993440ed1d04f957a8e5aa2e7e925c2594d55b065be448c92';
//Create account from the Address and PrivateKey
const senderAccount =  web3.eth.accounts.privateKeyToAccount(privateKey);
//Add account to the wallet
web3.eth.accounts.wallet.add(senderAccount);

app.post('/addPatient',(req,res) => {
  const patientName = req.body.patientName;
  const dob = req.body.dob;
  const adhar = req.body.adhar;
  const gender = req.body.gender;
  const insuranceId = req.body.insuranceId;


  contract.methods.addPatient(
    patientName,
    dob,
    adhar,
    gender,
    insuranceId
).send({ from: senderAccount.address, gas: 2000000 })
.on('transactionHash', (hash) => {
    console.log('Transaction Hash:', hash);
})
.on('receipt', (receipt) => {
    console.log('Transaction Receipt:', receipt);
})
.on('error', (error) => {
    console.error('Error:', error);
});
res.send("Added Patient✨")


});






//Api to upload files to IPFS
app.post('/upload', (req, res) => {
  const file = req.files.file;
  const fileName = req.body.fileName;
  const filePath = 'files/' + fileName;

  file.mv(filePath, async (err) => {
    if (err) {
      console.log('Error: failed to download file');
      return res.status(500).send(err);
    }
    const fileHash = await addFile(fileName, filePath);
    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
    });
    res.send({ fileName, fileHash });
  });
});

const addFile = async (fileName, filePath) => {
  const fileAdded = await new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
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

  const fileHash = fileAdded[0].hash;
  return fileHash;
};



app.listen(3000, () => {
  console.log('server is listening on port 3000');
});
