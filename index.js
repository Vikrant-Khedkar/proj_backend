const ipfsClient = require('ipfs-http-client');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload =  require('express-fileupload');
const fs  =  require('fs');
const ipfs =  new ipfsClient({host:'localhost',port:'5001',protocol:'http'});
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

app.get('/',(req,res) => {
  res.send('HI');
});

app.post('/upload',(req,res)=>{
    const file = req.files.file;
    const fileName = req.body.fileName;
    const filePath = 'files/'+ fileName;

    file.mv(filePath,async (err) => {
        if(err) {
            console.log("Error:failed to downlaod file");
            return res.status(500).send(err);
        }
        const fileHash = await addFile(fileName,filePath);
        fs.unlink(filePath,(err)=> {
            if(err) console.log(err);
        });
        res.send({fileName,fileHash});
    })
})
const addFile = async(fileName,filePath) =>{
    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({path:fileName,content:file});
    const fileHash = fileAdded[0].hash;
    
    return fileHash;
};

app.listen(3000,() => {
    console.log("server is listening on port 3000")
});
