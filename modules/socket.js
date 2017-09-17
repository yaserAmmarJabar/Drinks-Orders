var server = require('http').createServer(SendResponse);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.on("data", function (data) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var numberOfCups = data[key].number_of_cups;
        var Drink = data[key].drink;
        module.exports = {
          Drink: Drink,
          numberOfCups: numberOfCups,
          Server: server
        };
      }
     }
  });
});

function SendResponse(request, response) {
  fs.readFile('../views/inventory.html', function (error, html) {
    if (error) {
      console.log(error);
    } else {
      //when the html is loaded succesfully
      response.writeHead(200, commonHeaders);
      response.end(html);
    };
  });
};