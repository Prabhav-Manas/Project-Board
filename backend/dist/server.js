"use strict";

var http = require("http");
require("dotenv").config();
var app = require("./app");
var port = process.env.PORT || 9000;
var server = http.createServer(app);
server.listen(port, function () {
  console.log("Server is running on port ".concat(port));
});