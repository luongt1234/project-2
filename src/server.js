const express = require('express');
const cors = require('cors');

const app = express();

const port = 8080;
const hostName = 'localhost'

app.listen(port, hostName, () => {
    console.log(`Server is running on http://localhost:${port}/login`);
});