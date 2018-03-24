const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

/*
Send static page
 */
app.use(express.static(__dirname + '/public'));


/*
Other routes
 */

app.listen(PORT, () => console.log('Server running on localhost:' + PORT));