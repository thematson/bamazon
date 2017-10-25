var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
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

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    managerOptions();
});

function managerOptions() {
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'manager_option',
            message: 'Please select a manager option:',
            choices: ["View Products for Sale", 
                        "View Low Inventory", 
                        "Add to Inventory",
                        "Add New Product",
                        "End Manager Options"]
        }
    ]).then(function(option) {
        switch (option.manager_option){
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                lowInventory();
                break;

            case "Add to Inventory":
                addIventory();
                break;

            case "Add New Product":
                addNewProduct();
                break;

            case "End Manager Options":
                connection.end();
        }            
    });    
}

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        var table = new Table({
            head: ['Item ID', 
            'Product Name',
            'Department',
            'Price',
            'In Stock'], 
            colWidths: [10, 30, 20, 10, 10]
        });
        for (var i = 0; i<res.length; i++){
        table.push(
            [
            res[i].item_id,
            res[i].product_name,
            res[i].department_name,
            res[i].price,
            res[i].stock_quantity
            ]           
        );
        }
        console.log(table.toString());
        managerOptions();
        
});
}

function lowInventory(){
    connection.query("SELECT item_id, product_name, stock_quantity "
                    + "FROM products", function(err, res){
        if (err) throw err;
        var table = new Table({
            head: [
                'Item ID', 
                'Product Name',
                'In Stock'
            ], 
            colWidths: [10, 30, 10]
        });
        var lowStock = 0;
        for (var i = 0; i<res.length; i++){
            if (res[i].stock_quantity <= 5) {
                table.push(
                    [
                    res[i].item_id,
                    res[i].product_name,
                    res[i].stock_quantity
                    ]  
                );
                lowStock++;
            }
        }
        
        if (lowStock === 0){
            console.log("There is no low stock... You are a great Manager".rainbow);
        } else {
        console.log('The following stock is low:'.underline.red);
        console.log(table.toString());
        }
        managerOptions();
    });
}

function addIventory(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'add_inventory',
            message: 'Please enter the Item ID to add inventory:',
            default: 'Item ID',
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }            
        },
        {
            type: 'input',
            name: 'quantity_to_add',
            message: 'Please enter the quantity to add inventory:',
            // default: 'Item ID',
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }            
        }
    ]).then(function(addInv){    
        var product;
        var inStock;
        var addQuantity = parseInt(addInv.quantity_to_add);
        connection.query("SELECT item_id, product_name, stock_quantity "
        + "FROM products", function(err, res){
            // console.log(res[parseInt(addInv.add_inventory)].item_id);
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                if (parseInt(addInv.add_inventory) === res[i].item_id) {
                    product = res[i].product_name;
                    inStock = res[i].stock_quantity;
                } 
            }
            
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: inStock + addQuantity
                    },
                    {
                        product_name: product
                    }
                ],
                function(err,res){
                    // console.log(res.affectedRows + " products updated!");
                });            
            });
            managerOptions();
    });
}

function addNewProduct(){
    var deptArray = [];
    connection.query("SELECT department_name FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++){
            if (deptArray.indexOf(res[i].department_name) === -1){
            deptArray.push(res[i].department_name);
            }
        }
        deptArray.push("NEW");
        
    });
    inquirer.prompt([
        {
            type: 'input',
            name: 'new_product',
            message: 'Please enter the Product Name: '
        },
        {
            type: 'list',
            name: 'new_product_department',
            message: 'Please enter the Department',
            choices: deptArray
        },
        {
            type: 'input',
            name: 'new_product_price',
            message: 'Please enter the price of this Product:',
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }            
        },
        {
            type: 'input',
            name: 'new_product_stock',
            message: 'Please enter the Stock Quantity of this product:',
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }            
        }
    ]).then(function(newProduct){
        if (newProduct.new_product_department != 'NEW') {
            connection.query("INSERT INTO products SET ?",
            {
                product_name: newProduct.new_product,
        
                department_name: newProduct.new_product_department,
        
                price: newProduct.new_product_price,
        
                stock_quantity: newProduct.new_product_stock
            },
            function(err, res) {
                managerOptions();
              });
        } else {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'new_product_new_department',
                    message: 'Please enter the New Department: '
                }
            ]).then(function(newProdDep){
                connection.query("INSERT INTO products SET ?",
                {
                    product_name: newProduct.new_product,
            
                    department_name: newProdDep.new_product_new_department,
            
                    price: newProduct.new_product_price,
            
                    stock_quantity: newProduct.new_product_stock
                }
            );
            managerOptions();
            
            });
        }
    
       
    });
    
}