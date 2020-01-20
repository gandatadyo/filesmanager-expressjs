const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const formidable = require('formidable')
const pathview = path.join(__dirname + '/views')

const app = express()
const port = 3000

// [EJS tempalte engine]
app.use(express.static('views')) // static web router
app.use(express.static('tmp'))
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// [Body Parser middleware]
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



app.get('/', async (req, res) => {
    let search = req.query.search;
    var PATTERN = new RegExp(search);

    try {
        const testFolder = './tmp/';
        fs.readdir(testFolder, (err, files) => {
            // filter base name file
            dataList = files.filter(function (str) { return PATTERN.test(str); });
            res.render(pathview + '/main.html', { dataList: dataList, search: search });
        })

    } catch (error) {
        console.log(error);
    }
})


app.get('/delete/:namefile', async (req, res) => {
    let filename = req.params.namefile

    const testFolder = './tmp/';
    filepath = testFolder + filename
    fs.unlink(filepath, function (err) {
        if (err) throw err;
        console.log(`File "${filename}" deleted!`);
        res.redirect('/')
    });
})

app.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + "/tmp";
    form.multiples = true;
    form.parse(req, function (err, fields, files) {
        console.log("count files :"+files.sampleFile.length);

        if (files.sampleFile.length) {
            // if multiple file
            for (let index = 0; index < files.sampleFile.length; index++) {
                var tempFile = files.sampleFile[index].path // this temporary file
                var destFile = __dirname + '/tmp/' + files.sampleFile[index].name
                console.log(destFile);
                // this procedure for move temporary to directory desctination
                fs.rename(tempFile, destFile, (error) => {
                    if (error) {
                        res.send('Failed')
                    }
                })
            }
        } else {
            // if single file
            var tempFile = files.sampleFile.path // this temporary file
            var destFile = __dirname + '/tmp/' + files.sampleFile.name
            console.log(destFile);
            // this procedure for move temporary to directory desctination
            fs.rename(tempFile, destFile, (error) => {
                if (error) {
                    res.send('Failed')
                }
            })
        }

        res.redirect('/')
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))