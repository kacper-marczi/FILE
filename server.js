const express = require("express")
const path = require("path")
const hbs = require('express-handlebars')
const bodyParser = require("body-parser")
const formidable = require('formidable')

const app = express()
const port = process.env.PORT || 3000
let datatable = []
let nextid = 1

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.redirect("/filemanager")
})

app.get("/upload", function (req, res) {
    res.render('upload.hbs')
})

app.post("/upload", function (req, res) {
    const form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'
    form.keepExtensions = true
    form.multiples = true
    form.parse(req, function (err, fields, files) {
        if (files.filetoupload.length == undefined) {
            const temp = { id: nextid, name: files.filetoupload.name, path: files.filetoupload.path, size: files.filetoupload.size, type: files.filetoupload.type, savedate: Date.now(), img: undefined }
            nextid = nextid + 1
            switch (temp.type) {
                case "image/jpeg":
                    temp.img = "jpg"
                    break;
                case "image/png":
                    temp.img = "png"
                    break;
                case "text/plain":
                    temp.img = "text1"
                    break;
                case "application/pdf":
                    temp.img = "pdf1"
                    break;
                default:
                    temp.img = "unknown"
                    break;
            }
            datatable.push(temp)
            res.redirect("/filemanager")
        } else {
            for (const i = 0; i < files.filetoupload.length; i++) {
                const temp = { id: nextid, name: files.filetoupload[i].name, path: files.filetoupload[i].path, size: files.filetoupload[i].size, type: files.filetoupload[i].type, savedate: Date.now(), img: undefined }
                nextid = nextid + 1
                switch (temp.type) {
                    case "image/jpeg":
                        temp.img = "jpg"
                        break;
                    case "image/png":
                        temp.img = "png"
                        break;
                    case "text/plain":
                        temp.img = "text1"
                        break;
                    case "application/pdf":
                        temp.img = "pdf1"
                        break;
                    default:
                        temp.img = "unknown"
                        break;
                }
                datatable.push(temp)
            }
            res.redirect("/filemanager")
        }
    })
})

app.get("/clearFilemanagerAll", function (req, res) {
    datatable = []
    res.redirect("/filemanager")
})

app.get("/clearFilemanagerSingle/:id", function (req, res) {
    const deleteid = req.params.id
    const index = datatable.findIndex(object => object.id == deleteid)
    if (index != undefined) {
        datatable.splice(index, 1)
    }
    res.redirect("/filemanager")
})

app.get("/filemanager", function (req, res) {
    context = { datatable }
    res.render("filemanager.hbs", context)
})

app.get("/info", function (req, res) {
    const fileid = req.query.id
    const filedata = datatable.find(object => object.id == fileid)
    context = filedata
    res.render("info.hbs", context)
})

app.get('/download', function (req, res) {
    const fileid = req.query.id
    const filedata = datatable.find(object => object.id == fileid)
    res.download(filedata.path, filedata.name)
});

app.use(express.static('static'))

app.set('views', path.join(__dirname, 'views'))

app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: "views/partials",
    helpers: {
        shortName: function (text) {
            if (text.length > 20) {
                return text.substring(0, 17) + "...";
            }
            else {
                return text
            }
        },
    }
}));

app.set('view engine', 'hbs')

app.listen(port, function () {
    console.log("Serwer został uruchomiony na porcie: " + port)
})