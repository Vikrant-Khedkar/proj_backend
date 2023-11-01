const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const ipfsAPI = require('ipfs-api');

const ipfs = ipfsAPI("/ip4/127.0.0.1/tcp/5001");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('HI OM');
});

app.post('/')

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
