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
app.get("/users", function (req, res) {
    res.status(200);
    res.contentType("application/json");
    res.send(JSON.stringify(userList));
});
// TODO Korrekte Status-Codes!
app.post("/neueruser", function (req, res) {
    // TODO Email existiert schon?
    var vorname = req.body.vorname;
    var nachname = req.body.nachname;
    var email = req.body.email;
    var passwort = req.body.passwort;
    // Leere und undefinierte Strings ablehnen
    if (vorname && nachname && email && passwort
        && vorname !== '' && nachname !== '' && email !== '' && passwort !== '') {
        var user = new User(vorname, nachname, email, passwort);
        userList.push(user);
        res.status(200);
        res.contentType("application/json");
        res.send(JSON.stringify(userList));
    }
    else {
        res.status(404);
    }
});
app.put("/user/:id", function (req, res) {
    var vorname = req.body.vorname;
    var nachname = req.body.nachname;
    var email = req.body.email;
    var passwort = req.body.passwort;
    var editedUser;
    for (var _i = 0, userList_1 = userList; _i < userList_1.length; _i++) {
        var user = userList_1[_i];
        if (user.userid.toString() == req.params.id)
            editedUser = user;
    }
    if (editedUser !== undefined) {
        editedUser.editUser(vorname, nachname, passwort);
        res.status(200);
        res.contentType("application/json");
        res.send(JSON.stringify(editedUser));
    }
    else {
        // TODO Fehlermeldung schicken
        res.status(404).send("User with email " + email + " undefined");
    }
});
app.get("/user/:id", function (req, res) {
    var id = Number(req.params.id);
    var editedUser;
    for (var _i = 0, userList_2 = userList; _i < userList_2.length; _i++) {
        var user = userList_2[_i];
        if (user.userid == id)
            editedUser = user;
    }
    if (editedUser !== undefined) {
        res.status(200);
        res.contentType("application/json");
        res.send(JSON.stringify(editedUser));
    }
    else {
        // TODO Fehlermeldung schicken
        res.status(404).send("User with id " + id + " undefined");
    }
});
app.delete("/user/:id", function (req, res) {
    var id = Number(req.params.id);
    var idxUser;
    for (var _i = 0, userList_3 = userList; _i < userList_3.length; _i++) {
        var user = userList_3[_i];
        if (user.userid == id)
            idxUser = userList.indexOf(user);
    }
    if (idxUser !== undefined) {
        res.contentType("application/json");
        res.send(JSON.stringify(userList[idxUser]));
        userList.splice(idxUser, 1);
        res.status(200);
    }
    else {
        // TODO Fehlermeldung schicken
        res.sendStatus(204);
    }
});
// Warum bei getElementById "as HTML..." ?
// welcher Datentyp ist JSON? Object?
// Debuggen ??
// Muss '/neueruser' in Wirklichkeit '/user/:id' sein? -> nein
// Ordner-Struktur -> siehe Vorgabe von Manuel Groh
// bei get("/user/:id") gleichzeit :id und req.param
// Fehlermeldung des Servers wie zum Client schicken? (zb res.status(404).send("User with id " + id + " undefined") )
// TODO
