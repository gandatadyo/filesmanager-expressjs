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
// app.use(express.static('views')) // static web router
// app.use(express.static('temp'))
// app.engine('html', ejs.renderFile);
// app.set('view engine', 'html');

// [Body Parser middleware]
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const name_folder = 'temp'
const pathfile = __dirname + "/" + name_folder;
const testFolder = `./${name_folder}/`;


app.use(express.static('public'))
app.post('/getdata', async (req, res) => {
    let search = req.query.search;
    var PATTERN = new RegExp(search);
    try {
        // check folder, create if not found
        if (!fs.existsSync(testFolder)) fs.mkdirSync(testFolder)

        fs.readdir(testFolder, (err, files) => {
            // filter base name file
            dataList = files.filter(function (str) { return PATTERN.test(str); });
            res.send(dataList)
            // res.render(pathview + '/main.html', { dataList: dataList, search: search });
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/uploaddata', function (req, res) {
    console.log('Upload ===> ');
    var form = new formidable.IncomingForm();
    form.uploadDir = pathfile
    form.multiples = true;
    form.parse(req, function (err, fields, files) {
        console.log("count files :" + files.inputFile.length);

        if (files.inputFile.length) {
            // if multiple file
            for (let index = 0; index < files.inputFile.length; index++) {
                var tempFile = files.inputFile[index].path // this temporary file
                var destFile = pathfile + '/' + files.inputFile[index].name
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
            var tempFile = files.inputFile.path // this temporary file
            var destFile = pathfile + '/' + files.inputFile.name
            console.log(destFile);
            // this procedure for move temporary to directory desctination
            fs.rename(tempFile, destFile, (error) => {
                if (error) {
                    res.send('Failed')
                }
            })
        }
        res.send('success upload')
    });
});


// app.get('/', async (req, res) => {
//     let search = req.query.search;
//     var PATTERN = new RegExp(search);

//     try {
//         fs.readdir(testFolder, (err, files) => {
//             // filter base name file
//             dataList = files.filter(function (str) { return PATTERN.test(str); });
//             res.render(pathview + '/main.html', { dataList: dataList, search: search });
//         })

//     } catch (error) {
//         console.log(error);
//     }
// })


app.get('/delete/:namefile', async (req, res) => {
    let filename = req.params.namefile

    filepath = testFolder + filename
    if (!fs.existsSync(testFolder)) {
        fs.mkdirSync(testFolder);
    } else {
        fs.unlink(filepath, function (err) {
            if (err) throw err;
            console.log(`File "${filename}" deleted!`);
            res.redirect('/')
        });
    }
})

// app.post('/upload', function (req, res) {
//     var form = new formidable.IncomingForm();
//     form.uploadDir = pathfile
//     form.multiples = true;
//     form.parse(req, function (err, fields, files) {
//         console.log("count files :" + files.inputFile.length);

//         if (files.inputFile.length) {
//             // if multiple file
//             for (let index = 0; index < files.inputFile.length; index++) {
//                 var tempFile = files.inputFile[index].path // this temporary file
//                 var destFile = pathfile + '/' + files.inputFile[index].name
//                 console.log(destFile);
//                 // this procedure for move temporary to directory desctination
//                 fs.rename(tempFile, destFile, (error) => {
//                     if (error) {
//                         res.send('Failed')
//                     }
//                 })
//             }
//         } else {
//             // if single file
//             var tempFile = files.inputFile.path // this temporary file
//             var destFile = pathfile + '/' + files.inputFile.name
//             console.log(destFile);
//             // this procedure for move temporary to directory desctination
//             fs.rename(tempFile, destFile, (error) => {
//                 if (error) {
//                     res.send('Failed')
//                 }
//             })
//         }

//         res.redirect('/')
//     });
// });

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))