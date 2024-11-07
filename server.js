const { createServer } = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

server.on('request', (req, res) => {
    if (req.url === '/score') {
        dateForTesting = new Date();
        const scores = [
            { player: 1, score: 100, current: dateForTesting.getMinutes()%2==0 },
            { player: 2, score: 200, current: dateForTesting.getMinutes()%2==1 },
            { player: 3, score: 300 + dateForTesting.getMinutes(), current: false }
        ];
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Keep-Alive', 'timeout=0');
        res.end(JSON.stringify(scores));
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});