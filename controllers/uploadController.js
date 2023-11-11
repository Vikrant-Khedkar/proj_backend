const fs = require("fs");
const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI("/ip4/127.0.0.1/tcp/5001");

const uploadFile = async (req, res) => {
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
};

module.exports = { uploadFile };
