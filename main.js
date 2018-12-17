var inquirer = require("inquirer");
var mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect(function(err){
    if (err) throw err;
    searchStore();
})

function searchStore(){
    inquirer
        .prompt([
            {
                type: "input",
                message: "What would you like to do?",
                name: "input"
            }
        ]).then(function(res){
            if(res.input !== ""){
                breakDown(res.input);
            } else {
                searchStore();
            }
        })

};

function breakDown(arg){
    let input = arg.trim().split(" ");
    think(input);
}

function think(arg){
    let keyArr = ["buy", "purchase", "bid", "sell", "post", "list", "show", "search", "q", "quit", "e", "exit"];

    let key = keyArr.indexOf(arg[0]);

    switch (key){
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            preTable(arg);
            break;
        case 5:
        case 6:
            show(arg);
            break;
        case 7:
            search(arg);
            break;
        case 8:
        case 9:
        case 10:
        case 11:
            process.exit(exitCode())
            break;
    }
}

function preTable (arg) {
    switch (arg.length) {
        case 1:
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: `What would you like to ${arg[0].toString()}?`,
                        name: "item"
                    }
                ]).then(function(res){
                    if(res.item !== "") {
                        searchTable(res.item)
                    } else {
                        preTable (arg)
                    }
                })
            break;
        case 2:
            searchTable(arg.slice(1))
            break;
    }
}

function searchTable() {
    var query = "SELECT "
}

function show (arg) {

}

function exitCode() {
    console.log("Have a nice day!");
}