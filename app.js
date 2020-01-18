const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const path = require('path')
const fs = require('fs');


const pathview = path.join(__dirname + '/views')

const port = 80

// [Express file upload]
app.use(fileUpload());

// [EJS tempalte engine]
app.use(express.static('views')) // static web router
app.use(express.static('tmp'))
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// [Body Parser middleware]
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



app.get('/', async (req, res) => {
    // let search = req.query.search
    // var PATTERN = new RegExp(search);

    try {
        const testFolder = './tmp/';
        fs.readdir(testFolder, (err, files) => {
            console.log(files);
            // filter base name file
            // dataList = files.filter(function (str) { return PATTERN.test(str); });
            res.render(pathview + '/main.html', { dataList: files });
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
    console.log(req.files.sampleFile.length);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    } else {
        for (let index = 0; index < req.files.sampleFile.length; index++) {
            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            let sampleFile = req.files.sampleFile[index];

            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv('./tmp/' + sampleFile.name, function (err) {
                if (err)
                    return res.status(500).send(err);

            });
        }
        res.redirect('/')
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))