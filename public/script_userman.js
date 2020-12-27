"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen...
var axios_1 = require("axios");
document.addEventListener("DOMContentLoaded", function () {
    var out = document.getElementById("out");
    var tableUserList = document.getElementById("tableUserList");
    var formNeuerUser = document.getElementById("formNeuerUser");
    var formEditUser = document.getElementById("formEditUser");
    formNeuerUser.addEventListener("submit", function (event) {
        event.preventDefault();
        // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
        var data = new FormData(formNeuerUser);
        console.log(data);
        // Ein POST-Request wird an /echo adressiert und das (typenlose) Objekt {"in":"wert"} als Daten gesendet
        // Die anonymen Callbackfunktionen für then oder catch werden nach dem Eingang eines Responses aufgerufen
        axios_1.default.post("/neueruser", {
            "vorname": data.get("inputVorname"),
            "nachname": data.get("inputNachname"),
            "email": data.get("inputEmail"),
            "passwort": data.get("inputPasswort")
        }).then(function (value) {
            console.log("Response data:");
            console.log(value.data);
            // Neue Reihe in die User-Tabelle einfügen
            appendNewRow(value.data, tableUserList);
            formNeuerUser.reset();
        }).catch(function (reason) {
            out.innerText = "Es ist ein Fehler aufgetreten: " + reason;
        });
    });
    formEditUser.addEventListener("submit", function (event) {
        event.preventDefault();
        // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
        var data = new FormData(formEditUser);
        // console.log(data);
        axios_1.default.post("/edituser", {
            "vorname": data.get("editVorname"),
            "nachname": data.get("editNachname"),
            "email": data.get("editEmail"),
            "passwort": data.get("editPasswort")
        }).then(function (value) {
            // Neue Reihe in die User-Tabelle einfügen
            appendNewRow(value.data, tableUserList);
            formNeuerUser.reset();
        }).catch(function (reason) {
            out.innerText = "Es ist ein Fehler aufgetreten: " + reason;
        });
    });
});
function appendNewRow(data, tableUserList) {
    var row = tableUserList.insertRow(-1);
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    td1.innerHTML = data["vorname"];
    td2.innerHTML = data["nachname"];
    td3.innerHTML = data["email"];
    td4.innerHTML = "<td>\n" +
        "                 <button type=\"button\" class=\"btn btn-secondary btn-sm\">Edit</button>\n" +
        "                 <button type=\"button\" class=\"btn btn-danger btn-sm\">Delete</button>\n" +
        "            </td>";
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
}
