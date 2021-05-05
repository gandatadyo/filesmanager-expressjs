const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()
const port = 3000

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('public'))
const urlpath = "C:/Users/LENOVO/Desktop/initestupload/"//__dirname + `/inifileupload/`
app.use(express.static(urlpath))


const multer = require('multer')
const upload = multer({ dest: urlpath })
app.post('/upload', upload.single('myfile'), async function (req, res, next) {
    fs.rename(urlpath + req.file.filename, urlpath + req.file.originalname, function (err) {
        if (err) console.log('ERROR: ' + err);
        if (!err) {
            res.send({ status: 'true', message: 'berhasil mengupload gambar' })
        } else {
            res.send({ status: 'false', message: 'gagal mengupload gambar' })
        }
    });
})


app.post('/getdata', async (req, res) => {
    let search = req.body.search;
    let PATTERN = new RegExp(search);
    try {
        dataset = []
        fs.readdir(urlpath, (err, files) => {
            dataList = files.filter(function (str) { return PATTERN.test(str); });
            for (let i = 0; i < dataList.length; i++) {
                let stats = fs.statSync(urlpath + dataList[i]);
                if (stats.isFile()) {
                    dataset.push({ name: dataList[i], type: 'file' })
                }
                if (stats.isDirectory()) {
                    dataset.push({ name: dataList[i], type: 'folder' })
                }
            }

            res.send({ dataset: dataset, urlpath: urlpath })
        })
    } catch (error) {
        console.log(error);
    }
})


app.post('/deletedata', async (req, res) => {
    let namefile = req.body.namefile

    filepath = urlpath + namefile
    fs.unlink(filepath, function (err) {
        if (err) throw err;
        console.log(`File "${namefile}" deleted!`);
        res.send({ status: 'File berhasil dihapus' })
    });
})



app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))