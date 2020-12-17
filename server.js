"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express();
router.listen(8000, function () {
    console.log("Verbunden auf http://localhost:8000");
});
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use("/res", express.static(__dirname + "/public"));
router.use("/dependency", express.static(__dirname + "/node_modules"));
router.get("/", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/index.html");
});
router.post("/echo", function (req, res) {
    var input = req.body.in;
    res.status(200);
    res.send("Echo: " + input);
});
router.get("/module/:nr", function (req, res) {
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
