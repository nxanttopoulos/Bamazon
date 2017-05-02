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
    var objectList = results;
    var itemList = [];
    for (var i=0; i < objectList.length; i++){
      itemList.push(objectList[i]); 
    }
    console.log("Here is a list of items to buy!");
    console.log("id|name|department|price|stock");
    for (var i=0; i < itemList.length; i++){
      console.log(itemList[i].id, itemList[i].product_name, itemList[i].department_name, itemList[i].price,itemList[i].stock_quantity);
    }
    inquirer.prompt([
      {
        name: "choice",
        type: "input",
        message: "What item i.d. would you like to purchase?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?"
      }
    ]).then(function(answer) {
      var chosenObject;
      for (var i = 0; i < itemList.length; i++) {
        if (itemList[i].id == answer.choice) {
          chosenObject = itemList[i];
          //console.log(chosenObject);
        }
      }
      if (chosenObject.stock_quantity > answer.quantity) {
        connection.query("UPDATE products SET ? WHERE ?", [{
          stock_quantity: chosenObject.stock_quantity - answer.quantity
        }, {
          id: chosenObject.id
        }], function(error) {
          if (error) throw error;
          var total = answer.quantity * chosenObject.price;
          console.log("Your total is:  $"+ total + ".00");
          console.log("=======================");
          console.log("=======================");
          start();
        });
      }
      else {
        console.log("Insufficient Quantity!");
        console.log("=======================");
        console.log("=======================");
        start();
      }
    }).catch( function(error){
      console.log(error);
    });
  });
};
start();