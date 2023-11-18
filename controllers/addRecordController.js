
const { uploadFile } = require("./uploadController");
const { Web3 } = require("web3");
const contractAbi = require("../PatientRecords.json");
const web3 = new Web3("HTTP://127.0.0.1:7545");
const contractAddress = "0x3F60b39E6a70a34e2d14224df157F0BFb5D0c04E";
const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);

const senderAddress = "0x7d2A3CFd66373BeD7DA1f37Df9aCdBF822330a6a";
const privateKey = "0x97018b879227f5c993440ed1d04f957a8e5aa2e7e925c2594d55b065be448c92";
const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(senderAccount);
const multer = require("multer")

        

const upload = multer({ dest: "./uploads/" });

const addRecord = async (req, res) => {
    try {
        const id = req.body.id;
        const user_address = req.body.user_address;
        const title = req.body.title;
        const date = req.body.date;
        const filename = req.body.filename;
        const created_at = req.body.created_at;

        const file = await uploadFile(req.file, req.body.filename);
        console.log(file);
        console.log("File Uploaded")
        const data = [id, user_address, title, date, filename, file, created_at];
        console.log(req.body);
        console.log(data);

        contract.methods
            .addRecord(...data)
            .send({ from: senderAccount.address, gas: 3000000 })
            .on("transactionHash", (hash) => {
                console.log("Transaction Hash:", hash);
            })
            .on("receipt", (receipt) => {
                console.log("Transaction Receipt:", receipt);
            })
            .on("error", (error) => {
                console.error("Error:", error);
            });

        res.send({ "Message": "Added Record✨", "Data": data });
        console.log("Added Record");
    } catch (error) {
        console.error(error);
        res.status(500).send({ "Message": "Error adding record" });
    }
};

module.exports = { addRecord };


