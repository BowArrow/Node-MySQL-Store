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

connection.connect(function (err) {
    if (err) throw err;
    searchStore();
})

function searchStore() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What would you like to do?",
                name: "input"
            }
        ]).then(function (res) {
            if (res.input !== "") {
                breakDown(res.input);
            } else {
                searchStore();
            }
        })

};

function breakDown(arg) {
    let input = arg.trim().split(" ");
    think(input);
}

function think(arg) {
    let keyArr = ["buy", "purchase", "bid", "sell", "post", "list", "show", "search", "q", "quit", "e", "exit"];

    let key = keyArr.indexOf(arg[0]);

    switch (key) {
        case 0:
        case 1:
        case 2:
            preTable(arg);
            break;
        case 3:
        case 4:
            listItem(arg);
            break;
        case 5:
        case 6:
            show(arg);
            break;
        case 7:
            searchTable(arg.slice(1));
            break;
        case 8:
        case 9:
        case 10:
        case 11:
            process.exit(exitCode())
            break;
    }
}

function preTable(arg) {
    show("show")
    switch (arg.length) {
        case 1:
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: `What would you like to ${arg[0].toString()}?`,
                        name: "item"
                    }
                ]).then(function (res) {
                    if (res.item !== "") {
                        searchTable(res.item)
                    } else {
                        preTable(arg)
                    }
                })
            break;
        case 2:
            searchTable(arg.slice(1))
            break;
    }
}

function searchTable(arg) {
    let select = "SELECT * FROM listeditems WHERE item=?;"
    let none = ["none"];
    let qMove = "INSERT INTO solditems SELECT * FROM listeditems WHERE item=?;"
    let qRemove = "DELETE FROM listeditems WHERE item = ?"
    console.log(arg);
    connection.query(select, [arg], function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "confirm",
                    message: "Is this correct?",
                    default: true,
                    name: "confirm"
                }
            ]).then(function (response) {
                if (response.confirm) {
                    connection.query(qMove, [arg], function (err, res1) {
                        if (err) throw (err);
                        show("show")
                    })
                    connection.query(qRemove, [arg], function (err, res2) {
                        if (err) throw (err);
                        show([0, "sales"])
                    })
                } else {
                    searchStore();
                }
            })
    })
}

function show(arg) {
    let query = "SELECT * FROM ";
    let check = arg[1] || "listings";
    switch (check) {
        case "listings":
            connection.query(query + "listeditems;", function (err, res) {
                if (err) throw err;
                console.table(res);
                searchStore();
            });
            break;
        case "sales":
            connection.query(query + "solditems;", function (err, res) {
                if (err) throw err;
                console.table(res);
                searchStore();
            });
            break;
        default:
            console.log("I'm sorry I didn't understand")
            searchStore();
            break;
    }
}

function exitCode() {
    console.log("Have a nice day!");
}

function listItem(arg) {
    console.log(arg.length);
    let topics = ["Seller", "Item", "Price", "Quantity", "Department"]
    let insertItem = `INSERT INTO listeditems (seller, item, price, quantity, department) VALUES ('${arg[1]}', '${arg[2]}', ${arg[3]}, ${arg[4]}, '${arg[5]}')`
    var buildItem = `INSERT INTO listeditems (seller, item, price, quantity, department) VALUES (`
    switch (arg.length) {
        case 1:
            askSellInfo(0, topics, buildItem);
            break;
        case 2:
            console.log("Starting at 1");
            buildItem = checkBuild(1, arg, buildItem);
            askSellInfo(1, topics, buildItem);
            break;
        case 3:
            buildItem = checkBuild(2, arg, buildItem);
            askSellInfo(2, topics, buildItem);
            break;
        case 4:
            buildItem = checkBuild(3, arg, buildItem);
            askSellInfo(3, topics, buildItem);
            break;
        case 5:

            buildItem = checkBuild(4, arg, buildItem);
            askSellInfo(4, topics, buildItem);
            break;
        case 6:
            connectQ(insertItem);
            break;
    }

}
function connectQ(q) {
    connection.query(q, ["listeditems"], function (err, res) {
        if (err) throw err;
        console.log("Your item has been listed");
        searchStore();
    })
}
function checkBuild(start, arg, query) {
    for (var a = 1; a <= start; a++) {
        if(typeof arg[a] === "string"){
            query = query + "'" + arg[a] + "'";
        } else {
            query = query + arg[a];
        }
        query = query + ", ";
    }
    
    return query;
}
function askSellInfo(start, arr, query) {

    let run = askThis(start, arr, query);
    switch (start) {
        case 0:
            run;
            break;
        case 1:
            run;
            break;
        case 2:
            run;
            break;
        case 3:
            run;
            break;
        case 4:
            run;
            break;

    }
    function askThis(start, arr, query) {
        var q = query;
        var s = start;
        console.log(start);
        if (start <= 4) {
        inquirer
            .prompt([
                {
                    type: "input",
                    message: `${arr[start]}:`,
                    name: "info"
                }
            ]).then(function (res) {

                console.log(typeof res.info)
                if(typeof res.info === "string") {
                    q = q + "'" + res.info + "'";
                } else {
                    q = q + res.info;
                }
                if (start != 4) {
                    q = q + ", ";
                } else {
                    q = q + ");"
                }
                s += 1;
                console.log(q)
                askSellInfo(s, arr, q);

            })
        } else {
            connectQ(query);
        }
    }


}