var express = require('express');
var app = express();
var fs = require('fs');
var socket = require('socket.io');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'drinks_orders'
});
var commonHeaders = {
  'Content-Type': 'text/html'
};
var rareHeaders = {
  'Content-Type': 'text/plain'
};
var port = 3000;
var server = app.listen(port, function () {
  console.log('listening to requests on port ' + port + '.........');
});
app.get('/', function (request, response) {
  response.writeHead(200, commonHeaders);
  fs.createReadStream('./public/index.html').pipe(response);
});

app.get("/order", function (request, response) {
  response.writeHead(200, commonHeaders);
  fs.createReadStream('./order/order.html').pipe(response);
});
// Static Files
app.use(express.static('public'));
app.use(express.static('order'));
// Global Functions
// function checkDBIfEmpty(tableName) {
//   connection.query("SELECT * FROM " + tableName, function(error, rows, fields) {
//     if (error) {
//       console.log(error)
//       return error;
//     } else {
//       console.log(rows);
//       return rows
//     }
//   });
// }
// console.log(checkDBIfEmpty('menu'));
// Socket Setup
var io = socket(server);
io.on('connection', function (socket) {
  socket.on("data", function (data) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var numberOfCups = data[key].number_of_cups;
        var Drink = data[key].drink;
        addDrinkToDB(Drink, numberOfCups);
      }
    }
    console.log(data);
    /*********************************************
     Database Queries
    **********************************************/
    function addDrinkToDB(drinkName, drinkNumberOfCups) {
      var query = connection.query("SELECT * FROM menu WHERE drink = '" + drinkName + "'", function (error, rows, fields) {
        if (!!error) {
          console.error(error);
          console.log(query.sql);
        } else {
          console.log(query.sql);
          console.log("result is: ", rows);
          if (rows.length < 1) { // if it is empty (INSERT FUNCTION)
            console.log("in function INSERT");
            var InsertIntoString = 'INSERT INTO menu (drink, number_of_cups) values ("' + drinkName + '",' + drinkNumberOfCups + ');';
            var InsertIntoQuery = connection.query(InsertIntoString, function (err, result) {
              if (err) {
                socket.emit('success', {
                  'success': false
                });
                console.error(err);
              } else {
                socket.emit('success', {
                  'success': true
                });
                console.log(result);
              }
            });
          } else { // if it is not empty (UPDATE FUNCTION)
            console.log('in function UPDATE');
            var UpdateToDrinkString = "UPDATE menu SET drink = '" + drinkName + "', number_of_cups = " + drinkNumberOfCups + " WHERE drink = " + "'" + drinkName + "'" + " ;";
            console.log(UpdateToDrinkString);
            var UpdateToDrink = connection.query(UpdateToDrinkString, function (error, result) {
              if (error) {
                socket.emit('success', {
                  'success': false
                });
                console.error(error);
              } else {
                socket.emit('success', {
                  'success': true
                });
                console.log(result);
              }
            });
            console.log("black tea?");
          }
          console.log("Succesfully Queried");
        }
      });
    }
  });
});
