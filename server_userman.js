"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.listen(8080, function () {
    console.log("Verbunden auf http://localhost:8080");
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/res", express.static(__dirname + "/public"));
app.use("/dependency", express.static(__dirname + "/node_modules"));
app.get("/", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/userman.html");
});
app.post("/neueruser", function (req, res) {
    var input = req.body.vorname;
    res.status(200);
    // res.contentType("application/json");
    // res.send({'user1': input});
    res.send("Echo: " + input);
});
app.get("/module/:nr", function (req, res) {
    var nr = Number(req.params.nr);
    var module = ["OOP", "DM", "AuD", "GDI", "WBS", "LA"];
    if (module[nr] !== undefined) {
        res.status(200);
        res.send(module[nr]);
    }
    else {
        res.sendStatus(404);
    }
});
// Warum bei getElementById "as HTML..." ?
