const Game = require('./js/server/Game.js')
const Player = require('./js/server/Player.js');

const { createServer } = require('node:http');
const url = require('url');
const querystring = require('node:querystring'); 
const fs = require('fs');
const path = require('path');
const ext = /[\w\d_-]+\.[\w\d]+$/;
const hostname = '0.0.0.0';
const port = 3000;

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.doc': 'application/msword',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/x-font-ttf',
  };

var game = new Game();

const server = createServer((req, res) => {

});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

server.on('request', (req, res) => {
    //console.log(req.url);
    if (req.method === 'POST') {
        if(req.url === '/resetPlayers') {
            game.resetPlayers();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Keep-Alive', 'timeout=0');
            console.log(JSON.stringify(game));
            res.end(JSON.stringify(game.players));
        } else if(req.url === '/updatePlayerWallet') {
            let body = '';
            console.log('updatePlayerWallet');
            // Handle data chunks as they arrive
            req.on('data', (chunk) => {
            body += chunk;
            });
            console.log(body);
            // Handle end of data
            req.on('end', () => {
            try {
                const data = JSON.parse(body); // Assuming JSON data
                // Process the data here
                console.log(data);
                game.updatePlayerWallet(data.playerIndex, data.wheelValue, data.numCorrect);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(game));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON data');
            }
            });
        } else {
            console.log(req.url);
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('404 Not Found\n');
        }
    }
    if(req.method === 'GET') {
        if (ext.test(req.url)) {
            let pathname = path.join(__dirname, req.url);
            fs.exists(pathname, function (exists) {
                if (exists) {
                    const ext = path.parse(pathname).ext;
                    // if the file is found, set Content-type and send data
                    res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
                    //res.writeHead(200, {'Content-Type': 'text/html'});
                    fs.createReadStream(pathname).pipe(res);
                } else {
                    //console.log(req.url);
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('404 Not Found\n');
                }
            });
        } else if (req.url.startsWith('/score')) {
            const scores = [
                { player: game.players[0].index, score: game.players[0].wallet, current: game.playerIndex === 0 },
                { player: game.players[1].index, score: game.players[1].wallet, current: game.playerIndex === 1 },
                { player: game.players[2].index, score: game.players[2].wallet, current: game.playerIndex === 2 }
            ];
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Keep-Alive', 'timeout=0');
            res.end(JSON.stringify(scores));
        } else if (req.url.startsWith('/game')) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Keep-Alive', 'timeout=0');
            res.end(JSON.stringify(game));
        } else if (req.url.startsWith('/newRound')) {
            let query = url.parse(req.url).query;
            let params = querystring.parse(query);
            if(params !== null && params.player1 !== undefined) {
                game.setNames(params.player1, params.player2, params.player3);
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Keep-Alive', 'timeout=0');
            game.startRound();
            console.log(JSON.stringify(game));
            res.end(JSON.stringify(game));
        } else if (req.url.startsWith('/endRound')) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Keep-Alive', 'timeout=0');
            game.endRound();
            res.end(JSON.stringify(game));
        } else if (req.url.startsWith('/endTurn')) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Keep-Alive', 'timeout=0');
            game.endTurn();
            res.end(JSON.stringify(game));
        } else if (req.url.startsWith('/bankrupt')) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Keep-Alive', 'timeout=0');
            game.bankrupt();
            res.end(JSON.stringify(game));
        } else if (req.url.startsWith('/reset')) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Keep-Alive', 'timeout=0');
            game = new Game();
            res.end(JSON.stringify(game));
        } else if(req.url.startsWith('/updatePlayerWallet')) {
            let params = querystring.parse(url.parse(req.url).query);
            game.updatePlayerWallet(params.playerIndex, params.wheelValue, params.numCorrect);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(game));
        } else if(req.url.startsWith('/guessLetter')) {
            let params = querystring.parse(url.parse(req.url).query);
            game.lettersGuessed.push(params.letter);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(game));
        } else if(req.url.startsWith('/spin')) {
            let params = querystring.parse(url.parse(req.url).query);
            game.currentSpin = parseInt(params.spinValue);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(game));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('404 Not Found\n');
        }
    }
});
