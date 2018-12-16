const http = require('http')
const port = 3000
const RUNNER_ID = process.env.ID

const requestHandler = (request, response) => {
  console.log(request.url)
  response.end(`Hello from runner: ${RUNNER_ID}`);
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
