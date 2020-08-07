const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
var multer = require('multer')
var upload = multer({ dest: 'temp/' })

const app = express()
const port = 3000

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



const name_folder = 'temp'
const pathfile = __dirname + "/" + name_folder;
const testFolder = `./${name_folder}/`;
app.use(express.static('public'))
app.use(express.static('name_folder'))

app.post('/getdata', async (req, res) => {
    let search = req.body.search;
    let subfolder = req.body.subfolder;
    let PATTERN = new RegExp(search);
    try {
        // check folder storage, create if not found
        testFoldertemp = testFolder
        if (subfolder != '') {
            testFoldertemp = testFolder + subfolder + '/'
        }
        if (!fs.existsSync(testFoldertemp)) fs.mkdirSync(testFoldertemp)

        console.log(testFoldertemp);
        dataset = []
        fs.readdir(testFoldertemp, (err, files) => {
            dataList = files.filter(function (str) { return PATTERN.test(str); });
            for (let i = 0; i < dataList.length; i++) {
                let stats = fs.statSync(testFoldertemp + dataList[i]);
                if (stats.isFile()) {
                    dataset.push({ name: dataList[i], type: 'file' })
                }
                if (stats.isDirectory()) {
                    dataset.push({ name: dataList[i], type: 'folder' })
                }
            }
            res.send(dataset)
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/uploaddata', upload.array('inputFile', 12), function (req, res, next) {
    let dataobj = req.files
    console.log(dataobj);
    for (let i = 0; i < dataobj.length; i++) {
        let tempFile = dataobj[i].path
        let destFile = pathfile + '/' + dataobj[i].originalname
        fs.rename(tempFile, destFile, (error) => {
            if (error) {
                res.send('Failed')
            }
        })
    }
    res.send('true')
})

app.post('/deletedata', async (req, res) => {
    let namefile = req.body.namefile

    filepath = testFolder + namefile
    if (!fs.existsSync(testFolder)) {
        fs.mkdirSync(testFolder);
    } else {
        fs.unlink(filepath, function (err) {
            if (err) throw err;
            console.log(`File "${namefile}" deleted!`);
            res.send('true')
        });
    }
})

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))