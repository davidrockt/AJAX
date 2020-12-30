// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen...
// import axios, {AxiosResponse} from "axios";
var tableUserList = document.getElementById("tableUserList");
var formNeuerUser = document.getElementById("formNeuerUser");
var formEditUser = document.getElementById("formEditUser");
var editButtons = [];
var deleteButtons = [];
document.addEventListener("DOMContentLoaded", function () {
    formNeuerUser.addEventListener("submit", function (event) {
        event.preventDefault();
        // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
        var data = new FormData(formNeuerUser);
        console.log(data);
        var newEditButton;
        var newDeleteButton;
        // Ein POST-Request wird an /echo adressiert und das (typenlose) Objekt {"in":"wert"} als Daten gesendet
        // Die anonymen Callbackfunktionen für then oder catch werden nach dem Eingang eines Responses aufgerufen
        axios.post("/neueruser", {
            "vorname": data.get("inputVorname"),
            "nachname": data.get("inputNachname"),
            "email": data.get("inputEmail"),
            "passwort": data.get("inputPasswort")
        }).then(function (value) {
            // Neue Reihe in die User-Tabelle einfügen
            appendNewRow(value.data, tableUserList);
            // Edit- und Delete-Button mit EventListener ausstatten
            newEditButton = document.getElementById('btnEdit' + value.data['userid']);
            newEditButton.addEventListener('click', editUser);
            editButtons.push(newEditButton);
            newDeleteButton = document.getElementById('btnDelete' + value.data['userid']);
            newDeleteButton.addEventListener('click', deleteUser);
            deleteButtons.push(newDeleteButton);
            // Form-Inhalte zurücksetzen
            formNeuerUser.reset();
        }).catch(function (reason) {
            console.log("Es ist ein Fehler aufgetreten: " + reason);
        });
    });
    formEditUser.addEventListener("submit", function (event) {
        event.preventDefault();
        // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
        var data = new FormData(formEditUser);
        axios.post("/edituser", {
            "vorname": data.get("editVorname"),
            "nachname": data.get("editNachname"),
            "passwort": data.get("editPasswort"),
            "id": data.get("editId")
        }).then(function (value) {
            /**
             *  TODO Tabellen-Reihe mit geänderten Werten aktualisieren
             */
            // Form wieder verbergen
            formEditUser.style.visibility = "hidden";
        }).catch(function (reason) {
            console.log("Es ist ein Fehler aufgetreten: " + reason);
        });
    });
});
function editUser(event) {
    var btn = event.currentTarget;
    // Id ermitteln: erste 7 Zeichen abschneiden ("btnEdit0" -> 0)
    var id = btn.id.substr(7);
    /**
     * TODO Werte inkl id in die Form schreiben
     */
    formEditUser.style.visibility = "visible";
}
function deleteUser(event) {
    console.log("Delete Function");
    var btn = event.currentTarget;
    var id = btn.id.substr(9);
    axios.post('deleteUser', {
        'id': id
    }).then(function (value) {
    }).catch(function (reason) {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
    });
}
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
        "                 <button id='btnEdit" + data['userid'] + "' type=\"button\" class=\"btn btn-secondary btn-sm\">Edit</button>\n" +
        "                 <button id='btnDelete" + data['userid'] + "'type=\"button\" class=\"btn btn-danger btn-sm\">Delete</button>\n" +
        "            </td>";
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
}
