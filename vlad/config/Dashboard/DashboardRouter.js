const express = require('express');
const api = express();
let mysql      = require('mysql');
let connection;
let db_config = {
    host     : 'qweeex1997.beget.tech',
    user     : 'qweeex1997_vlad',
    password : 'p%b9Tjrv',
    database : 'qweeex1997_vlad'
}

function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.

    connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

// Главаная админки
api.get('/dashboard', (req,res) => {
    res.render("Dashboard/index", {
        title: "Админ панель"
    });
})
api.get('/dashboard/list', (req,res) => {

    connection.query('SELECT * FROM `node_orders`', function (error, results, fields) {
        if (error) {
            res.send(error);
        } else {
            let OrderList = [];
            results.forEach(function (item) {
                let id = item.id;
                let content = JSON.parse(item.orders);

                OrderList.push({
                    id: id,
                    content: content
                })
            })
            res.status(200).json(OrderList);

            handleDisconnect();
        }
    });
})

/*
*
*   Роуты на категории
*
* */

// Список категорий
api.get('/dashboard/category', (req,res) => {

    connection.query('SELECT * FROM `node_category`', function (error, results, fields) {
        if (error) {
            res.send(error);
        } else {
            res.render("Dashboard/Category/CategoryList", {
                title: "Список категорий",
                category: results
            });
            handleDisconnect();
        }
    });

});
// Добавление категории
api.get('/dashboard/category/add', (req,res) => {
    res.render("Dashboard/Category/CategoryAdd", {
        title: "Список категорий",
    });
})
// Изменение категории
api.get('/dashboard/category/change', (req,res) => {
    res.render("Dashboard/Category/CategoryChange", {
        title: "Список категорий",
    });
})

/*
*
*   Роуты на товары
*
* */

// Список товаров
api.get('/dashboard/products', (req,res) => {
    connection.query('SELECT * FROM `node_product`', function (error, results, fields) {
        if (error) {
            res.send(error);
        } else {
            res.render("Dashboard/Product/ProductList", {
                title: "Список товаров",
                products: results
            });
            handleDisconnect();
        }
    });
})

// Добавление товара
api.get('/dashboard/products/add', (req,res) => {
    res.render("Dashboard/Product/ProductAdd", {
        title: "Список товаров",
    });
})

// Изменение товара
api.get('/dashboard/products/change', (req,res) => {
    res.render("Dashboard/Product/ProductChange", {
        title: "Список товаров",
    });
})
api.post('/dashboard', (req, res) => {
    connection.query('TRUNCATE ` node_orders `', function (error, results, fields) {
        if (error) {
            res.send(error);
        } else {
            res.render("Dashboard/index", {
                title: "Админ панель"
            });
            handleDisconnect();
        }
    });
})

//DELETE FROM `node_product` WHERE `node_product`.`id` = 6

module.exports = api;