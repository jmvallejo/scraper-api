var request = require('request');
var cheerio = require('cheerio');
var express = require('express');

function scrapeTRMBanrep(){
	return new Promise(function(resolve, reject){
		var options = {
			url: 'http://www.banrep.gov.co/indichtml/trm.html',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
			}
		};
		request(options, function(error, response, html){
			if(!error){
				var $ = cheerio.load(html);

				var json = { type: null, date : null, value : null };

				var text = $('.ResultsTable tr').first().text();
				if(text){
					var tokens = text.trim().split(' ');
					json.type = tokens[0];
					json.date = tokens[1];
					json.value = tokens[2] ? parseFloat(tokens[2].replace('.', '').replace(',', '.')) : null;
				}

				resolve(json);
			} else {
				reject(error);
			}
		});
	});
}

var app = express();
app.get('/trm', function(req, res){
	console.log('Started scraping...');
	scrapeTRMBanrep().then(function(result){
		console.log(result);
		res.send(result);
	}).catch(function(error){
		console.error(error);
		res.send(error);
	});
});

var port = process.env.PORT || 8080
app.listen(port);
console.log('Server started on port ' + port + '...');
exports = module.exports = app;