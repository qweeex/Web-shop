const express = require('express');
const router = express();
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

router.get('/', (req, res) => {
    let category;
    let product;
    connection.query('SELECT * FROM `node_category`', function (error, results, fields) {
        if (error) {
            res.send(error);
        } else {
            category = results;
            handleDisconnect();
            connection.query('SELECT * FROM `node_product` LIMIT 8', function (error, results, fields) {
                if (error) {
                    res.send(error);
                } else {
                    product = results;
                    res.render("index", {
                        title: "Главная",
                        category: category,
                        products: product
                    });
                    handleDisconnect();
                }
            });
        }
    });
})

router.get('/checkout', (req,res) => {
    let category;
    connection.query('SELECT * FROM `node_category`', function (error, results, fields) {
        if (error) {
            res.send(error);
        } else {
            category = results;
            res.render("checkout", {
                title: 'Корзина',
                category: category,
            });
            handleDisconnect();
        }
    });

})

router.get('/product/:id', (req,res) => {
    if (req.params.id){
        let category;
        connection.query('SELECT * FROM `node_category`', function (err, rest, fields) {
            if (err) {
                res.send(err);
            } else {
                category = rest;
                handleDisconnect();
                connection.query('SELECT * FROM `node_product` WHERE `product_url` = "' + req.params.id + '"', function (error, results, fields) {
                    if (error) {
                        res.send(error);
                    } else {
                        if (results.length){
                            res.render("single", {
                                title: results[0].product_name,
                                category: category,
                                product: results
                            });
                            handleDisconnect();
                        } else {
                            res.send('404');
                        }

                    }
                });
            }
        });

    }
})

router.get('/category/:id', (req,res) => {
    res.send(`Category is ${req.params.id}`);
})


module.exports = router;