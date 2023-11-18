const fs = require("fs");
const { url } = require("inspector");
const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI("/ip4/127.0.0.1/tcp/5001");

const uploadFile = async (_file, _fileName) => {
  try {
    const file = _file;
    console.log(file);
    const fileName = _fileName;
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
    const fileUrl = `ipfs://${fileHash}`;
    return (fileUrl);

    // res.send({ url, fileName, fileHash });
    console.log(url, fileName, fileHash);
  } catch (error) {
    console.error("Error uploading file:", error);
    // res.status(500).send("Internal Server Error");
  }
};

module.exports = { uploadFile };
