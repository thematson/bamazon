const mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazon"
});
function connectionIsMade(){
connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    userOrder();
});
}
function orderAgain(){
    userOrder();
}

function userOrder() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Hello. Which product number would you like to purchase: ',
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'Please enter the quantity number you desire: ',
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function(userOrder) {
      var query = connection.query('SELECT * FROM products WHERE ?',
        [         
          {
              item_id: userOrder.item_id
          }
        ],
        function(err, res){
            if (err) throw err;
            var stockQuantity = res[0].stock_quantity;
            var orderQuantity = userOrder.stock_quantity;
            if (parseInt(userOrder.stock_quantity) <= parseInt(res[0].stock_quantity)) {
                console.log("Your item can be fulfilled".green);
                console.log("You are the proud owner of ".blue + userOrder.stock_quantity.blue 
                            + " " + res[0].product_name.blue + "s".blue);
                connection.query('UPDATE products SET ? WHERE ?',
                [
                    {
                        stock_quantity: stockQuantity - orderQuantity
                    },
                    {
                        item_id: userOrder.item_id
                    }
                ],
                function(err, res){
                    if (err) throw err;
                    orderAgain();
                });
            } else {
                console.log("There is insufficient stock".red);
                orderAgain();
                }
        });
        
    //   console.log(query.sql); 
});

}

connectionIsMade();
