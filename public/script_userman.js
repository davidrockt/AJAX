// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen...
// import axios, {AxiosResponse} from "axios";
document.addEventListener("DOMContentLoaded", function () {
    var userTableBody = document.getElementById("tbody");
    var formNeuerUser = document.getElementById("formNeuerUser");
    var formEditUser = document.getElementById("formEditUser");
    var pEditMessage = document.getElementById("edit-message");
    userTableBody.addEventListener('click', editAndDeleteUser);
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
            // Tabelle aktualisieren
            updateUserList();
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
            "email": data.get("editEmail")
        }).then(function (value) {
            updateUserList();
            // Form wieder verbergen
            formEditUser.style.visibility = "hidden";
        }).catch(function (reason) {
            console.log("Es ist ein Fehler aufgetreten: " + reason);
            pEditMessage.innerText = "Es ist ein Fehler aufgetreten: " + reason;
        });
    });
});
function editAndDeleteUser(event) {
    var element = event.target;
    if (element.matches('.edit-user-button')) {
        editUser(event);
    }
    else if (element.matches('.delete-user-button')) {
        deleteUser(event);
    }
}
function renderUserList(userList) {
    var tableUserList = document.getElementById("tableUserList");
    var userTableBody;
    var new_tbody = document.createElement('tbody');
    new_tbody.id = 'tbody';
    var row;
    var td1, td2, td3, td4;
    for (var _i = 0, userList_1 = userList; _i < userList_1.length; _i++) {
        var user = userList_1[_i];
        row = new_tbody.insertRow();
        td1 = document.createElement('td');
        td2 = document.createElement('td');
        td3 = document.createElement('td');
        td4 = document.createElement('td');
        td1.innerHTML = user["vorname"];
        td2.innerHTML = user["nachname"];
        td3.innerHTML = user["email"];
        td4.innerHTML = "<td>\n" +
            "                 <button id='edit" + user['userid'] + "' type=\"button\" class=\"btn btn-secondary btn-sm edit-user-button\">Edit</button>\n" +
            "                 <button id='delete" + user['userid'] + "' type=\"button\" class=\"btn btn-danger btn-sm delete-user-button\">Delete</button>\n" +
            "            </td>";
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td4);
    }
    var old_tbody = document.getElementById('tbody');
    tableUserList.replaceChild(new_tbody, old_tbody);
    userTableBody = document.getElementById("tbody");
    userTableBody.addEventListener('click', editAndDeleteUser);
}
function updateUserList() {
    axios.get('/users')
        .then(function (value) {
        renderUserList(value.data);
    });
}
function editUser(event) {
    var formEditUser = document.getElementById("formEditUser");
    var inputVorname = document.getElementById("editVorname");
    var inputNachname = document.getElementById("editNachname");
    var inputEmail = document.getElementById("editEmail");
    var btn = event.target;
    // Id ermitteln: erste 4 Zeichen abschneiden ("edit0" -> 0)
    var id = btn.id.substr(4);
    axios.get("/user/" + id).then(function (value) {
        formEditUser.style.visibility = "visible";
        inputVorname.value = value.data['vorname'];
        inputNachname.value = value.data['nachname'];
        inputEmail.value = value.data['email'];
    }).catch(function (reason) {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
    });
}
function deleteUser(event) {
    var btn = event.target;
    var id = btn.id.substr(6);
    axios.delete('delete/' + id)
        .then(function (value) {
        console.log("Deleted:");
        console.log(value.data);
        updateUserList();
    }).catch(function (reason) {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
    });
}
