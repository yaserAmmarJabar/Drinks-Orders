// Main Variables
var server = require('http').createServer(SendResponse);
var mysql = require('mysql');
var fs = require('fs');
var io = require('socket.io')(server);
var commonHeaders = {
  'Content-Type': 'text/html'
};
var rareHeaders = {
  'Content-Type': 'text/plain'
};
// Creating connection to mysql database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'drinks_orders'
});

server.listen(4000);

 /*********************************************
    Sending Response for Server Callers
  *********************************************/
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
  /*********************************************
    Socket Code (Data From Client)
  *********************************************/
    io.on('connection', function (socket) {
      socket.on("data", function (data) {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var numberOfCups = data[key].number_of_cups;
            var Drink = data[key].drink;
            console.log(data);
          }
        }
    /*********************************************
     Database Queries
    *********************************************/
      data.forEach(function() {
        console.log("Element");
      });
      
        console.log("Succesfully Queried");
     
    });
      });
    });

  console.log('Server is Running on Port 4000......');