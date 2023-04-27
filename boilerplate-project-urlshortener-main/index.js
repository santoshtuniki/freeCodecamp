require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// dns
const dns = require('dns');

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
	res.json({ greeting: 'hello API' });
});

const originalUrls = [];
const shortUrls = [];

app.post('/api/shorturl', (req, res) => {
	const url = req.body.url;
	const index = originalUrls.indexOf(url);

	// whether a url is 'valid/not'
	if (!(/^https?:\/\//i).test(url)) {
		return res.json({ error: 'invalid url' })
	}

	// if url 'not' included
	if (index < 0) {
		originalUrls.push(url);
		shortUrls.push(shortUrls.length);

		return res.json({
			original_url: url,
			short_url: shortUrls.length - 1
		})
	}

	// if url is 'already' included
	return res.json({
		original_url: url,
		short_url: shortUrls[index]
	})
});

// redirected to the original URL.
app.get('/api/shorturl/:shorturl', (req, res) => {
	const shorturl = Number(req.params.shorturl);
	const index = shortUrls.indexOf(shorturl);

	if (index < 0) {
		return res.json({
			error: "NO short url found for given input"
		})
	}
	res.redirect(originalUrls[index]);
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
