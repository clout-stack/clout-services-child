/**
 * Services Test
 */
const
	should = require('should'),
	request = require('request'),
	path = require('path'),
	fs = require('fs'),
	archivePath = path.join(__dirname, '/resources/release_0.0.1.zip');

var clout = null;

describe('services test', function () {
	var url = 'http://';

	before(function startService(done) {
		require('..'); // start service
		clout = require('clout-js');
		// get port
		clout.once('started', function () {
			var address = clout.server.http.address();
			url += '127.0.0.1:' + address.port;
			setTimeout(done);
		});
	});

	it('create docker container w/ NodeJS application', function (done) {
		this.timeout(1000000);
		var uri = url + '/api/dev/tester/service?application=' + JSON.stringify({ name: 'tester', id: 'tester' });
		console.log(uri);
		request({
			method: 'PUT',
			uri: uri,
		    preambleCRLF: true,
		    postambleCRLF: true,
			multipart: [
				{ 
			        'Content-Disposition' : 'name="archive"; filename="archive.zip"',
			        'Content-Type' : 'application/octet-stream',
			        // 'Content-Length': size,
			        body: fs.createReadStream(archivePath)
			    }
			],
			headers: {
				'User-Agent': 'cloutCLI',
			},
			json: true,
			alive: true
		}, function (err, resp, body) {
			should.not.exist(err);
			should.exist(body);
			should(body).be.a.Object();
			body.success.should.be.eql(true, body.data);
			done();
		});
	});
});