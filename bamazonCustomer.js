var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Login2014!",
  database: "bamazon"
});
connection.connect(function(err) {
  if (err) throw err;
});
var start = function() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    var objectList = [];
    objectList.push(results);
    var itemList = [];
    for (i=0; i < objectList.length; i++){
      for (j=0; j < objectList[i].length; j++){
        itemList.push(objectList[i][j]);
    }    }
    console.log("id|name|department|price|stock")
    for (i=0; i < itemList.length; i++){
      console.log(itemList[i].id, itemList[i].product_name, itemList[i].department_name, itemList[i].price,itemList[i].stock_quantity);
    }
    inquirer.prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].id);
          }
          return choiceArray;
        },
        message: "What item i.d. would you like to purchase?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?"
      }
    ]).then(function(answer) {
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (results[i].id === answer.choice) {
          chosenItem = results[i];
        }
      }
      if (chosenItem.stock_quantity > answer.quantity) {
        connection.query("UPDATE products SET ? WHERE ?", [{
          stock_quantity: chosenItem.stock_quantity - answer.quantity
        }], function(error) {
          if (error) throw err;
          console.log("Enoy your fresh produce!");
          start();
        });
      }
      else {
        console.log("Insufficient Quantity!");
        start();
      }
    });
  });
};
start();