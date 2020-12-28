"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var idxUser = 0;
var User = /** @class */ (function () {
    function User(vorname, nachname, email, passwort) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.passwort = passwort;
        this.userid = idxUser;
        idxUser++;
    }
    User.prototype.editUser = function (vorname, nachname, passwort) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.passwort = passwort;
    };
    return User;
}());
var userList = [];
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
    var vorname = req.body.vorname;
    var nachname = req.body.nachname;
    var email = req.body.email;
    var passwort = req.body.passwort;
    var user = new User(vorname, nachname, email, passwort);
    userList.push(user);
    res.status(200);
    res.contentType("application/json");
    res.send(JSON.stringify(user));
});
app.post("/edituser", function (req, res) {
    var vorname = req.body.vorname;
    var nachname = req.body.nachname;
    var email = req.body.email;
    var passwort = req.body.passwort;
    var editedUser;
    for (var _i = 0, userList_1 = userList; _i < userList_1.length; _i++) {
        var user = userList_1[_i];
        if (user.email == email)
            editedUser = user;
    }
    editedUser.editUser(vorname, nachname, passwort);
    res.status(200);
    res.contentType("application/json");
    res.send(JSON.stringify(editedUser));
});
app.post("/deleteUser", function (req, res) {
    var id = req.body.id;
    var idx;
    for (var _i = 0, userList_2 = userList; _i < userList_2.length; _i++) {
        var user = userList_2[_i];
        if (user.userid == id)
            idx = userList.indexOf(user);
    }
    console.log('idx = ' + idx);
    userList.splice(idx, 1);
    res.status(200);
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
// welcher Datentyp ist JSON? Object?
