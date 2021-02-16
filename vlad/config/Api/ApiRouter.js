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


// Создаем заказ
api.post('/checkout', (req,res) => {
    let data = req.body;
    connection.query('INSERT INTO `node_orders` (`id`, `orders`) VALUES (NULL, \' ' + JSON.stringify(data) + ' \')', function (error, results, fields) {
        if (error) {
            res.send(error);
        } else {
            res.json({
                status: true,
                code: 200,
                message: "Order add"
            })
            handleDisconnect();
        }
    });
})

//////////////////////////////
api.post('/checkout/cart', (req, res) => {
    let data = req.body;
    let CartID = '';
    let cart = [];
    if (data.id){
        connection.query('SELECT * FROM `node_product` WHERE `id` IN ('  +  data.id  + ")", function (error, results, fields) {
            if (error) {
                res.send(error);
            } else {
                res.json(results);
                handleDisconnect();
            }
        });
    } else{
        data.forEach(function (item) {
            CartID += item.id + ",";
        });
        CartID = CartID.substring(0, CartID.length - 1);
        connection.query('SELECT * FROM `node_product` WHERE `id` IN ('  +  CartID  + ")", function (error, results, fields) {
            if (error) {
                res.send(error);
            } else {
                res.json(results);
                handleDisconnect();
            }
        });
    }
})

module.exports = api;