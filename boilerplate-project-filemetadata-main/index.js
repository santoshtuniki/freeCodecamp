var express = require('express');
var cors = require('cors');
require('dotenv').config()
var app = express();

// require 'multer'
const multer = require('multer');

// require 'body-parser'
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));	// as body is a 'file'
app.use(bodyParser.json());

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

// Configuration for Multer
const upload = multer({ dest: "public/files" });

app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
	// console.log(req.file);
	res.json({
		name: req.file.originalname,
		type: req.file.mimetype,
		size: req.file.size
	});
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Your app is listening on port ' + port)
});
