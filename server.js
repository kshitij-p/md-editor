const express = require('express');


const app = express();

let port = process.env.PORT;

if (process.env.NODE_ENV !== "production") {
    port = '9000';
}

app.listen(9000, (e) => {
    console.log('Listening to port 9000')
})