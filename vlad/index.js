const express = require('express');
const app = express();
const PORT = 4444;
const Router = require('./config/Router');
const Api = require('./config/Api/ApiRouter');
const Dashboard = require('./config/Dashboard/DashboardRouter');
const bodyParser = require('body-parser')
const session = require('express-session');
app.use(session({
    secret: '2h3jg42h3jg42hj34g',
    saveUninitialized: true
}));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}))

app.use('/public', express.static('public'))
app.use('/uploads', express.static('uploads'))

app.set('view engine', 'ejs');
app.use(Router);
app.use(Api);
app.use(Dashboard);

app.listen(PORT, (err) => {
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})

