const { createServer } = require('node:http');

//const hostname = '127.0.0.1';
const hostname = '0.0.0.0';
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
        secondDigit = dateForTesting.getSeconds() % 10
        p1Curr = secondDigit < 5
        console.log("p1Curr: %d, bool %d", secondDigit, p1Curr)
        const scores = [
            { player: 1, score: 100 + secondDigit, current: p1Curr },
            { player: 2, score: 200 + 10 * secondDigit, current: !p1Curr },
            { player: 3, score: 300 + dateForTesting.getSeconds(), current: false }
        ];
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(scores) + '\n');
    } else {
        res.statusCode = 404;
        res.end('Not Found\n');
    }
});