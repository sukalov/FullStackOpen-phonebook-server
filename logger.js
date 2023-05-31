import morgan from 'morgan'

morgan.token('postContent', (req) => {
  let a
  if (req.method === 'POST') {a =  JSON.stringify(req.body)} else {
    a = ''
  }
  return a
})

morgan.token('statusColor', (req, res) => { // original function taken from https://stackoverflow.com/questions/36284015/morgan-node-js-coloring-status-code-as-in-dev-while-using-custom-format
  const status = res.statusCode
  const color = status >= 500 ? 31 // red
    : status >= 400 ? 33 // yellow
      : status >= 300 ? 36 // cyan
        : status >= 200 ? 32 // green
          : 0 // no color
  return '\x1b[' + color + 'm' + status + '\x1b[0m'
})

const logger = morgan(':statusColor :method\x1b[0m \x1b[36m:url\x1b[0m :response-time ms :postContent - length|:res[content-length]')
export default logger