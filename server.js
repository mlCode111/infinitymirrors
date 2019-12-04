const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

// the __dirname is the current directory from where the script is running
app.use(express.static(path.join(__dirname + '/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname + '/dist'), 'index.html'));
});

let server = app.listen(port, function() {
  console.log('listening on port ', server.address().port);
});