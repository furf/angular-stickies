var SERVER_PORT = 8080,
    connect = require('connect'),
    sharejs = require('share'),
    server = connect(connect['static'](__dirname + '/public')),
    options = { db: { type: 'none' } };
    share = sharejs.server.attach(server, options);

sharejs.types['json-array'] = require('./lib/share/types/json-array');
sharejs.types['json-object'] = require('./lib/share/types/json-object');

server.listen(SERVER_PORT);

/* ShareJS client (for observation) */
share.model.on('add', function (name, document) {
  sharejs.client.open(name, 'text', 'http://localhost:' + SERVER_PORT + '/channel', function (err, doc) {
    if (err) return console.error(err);
    var docName = '\u001b[7m\u001b[1m ' + name + ' \u001b[22m\u001b[27m';
    doc.on('change', function (op) {
      console.log(docName, doc.version, JSON.stringify(op));
    });
  });
});
