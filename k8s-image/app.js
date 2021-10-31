//Load express module with `require` directive
const express = require('express')
const app = express()

const PORT = process.env.PORT || 80;
const path = __dirname + '/views/';

const router = express.Router();


router.use(function (req,res,next) {
    console.log('/' + req.method);
    next();
});

router.get('/', function(req,res){
    res.sendFile(path + 'index.html');
});

router.get('/sharks', function(req,res){
    res.sendFile(path + 'sharks.html');
});

app.use(express.static(path));
app.use('/', router);

app.listen(PORT, function () {
    console.log(`app listening on port ${PORT}!`)
})