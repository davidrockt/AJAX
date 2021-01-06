// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen...
// import axios, {AxiosResponse} from "axios";
document.addEventListener("DOMContentLoaded", function () {
    var userTableBody = document.getElementById("tbody");
    var formNeuerUser = document.getElementById("formNeuerUser");
    var formEditUser = document.getElementById("formEditUser");
    userTableBody.addEventListener('click', editAndDeleteUser);
    formNeuerUser.addEventListener("submit", addUser);
    formEditUser.addEventListener("submit", editUser);
});
function addUser(event) {
    // Neuen User mit den Werten aus formNeuerUser hinzufügen -> POST /neueruser
    var formNeuerUser = document.getElementById("formNeuerUser");
    event.preventDefault();
    // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
    var data = new FormData(formNeuerUser);
    // TODO Check if all required fields are filled in
    // const lastName: string = lastNameField.val().toString().trim();
    // if (firstName && lastName) {
    axios.post("/neueruser", {
        "vorname": data.get("inputVorname"),
        "nachname": data.get("inputNachname"),
        "email": data.get("inputEmail"),
        "passwort": data.get("inputPasswort")
    }).then(function () {
        // Tabelle aktualisieren
        updateUserList();
        // Form-Inhalte zurücksetzen
        formNeuerUser.reset();
    }).catch(function (reason) {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
    });
}
function editUser(event) {
    // Veränderte Werte eines Users aus formEditUser entnehmen, Server schicken
    // und Tabellen-Inhalt updaten -> PUT /user/:id
    var formEditUser = document.getElementById("formEditUser");
    var pEditMessage = document.getElementById("edit-message");
    event.preventDefault();
    // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
    var data = new FormData(formEditUser);
    axios.put("/user/" + data.get("editId"), {
        "vorname": data.get("editVorname"),
        "nachname": data.get("editNachname"),
        "passwort": data.get("editPasswort"),
        "email": data.get("editEmail")
    }).then(function () {
        updateUserList();
        // Form wieder verbergen
        formEditUser.style.visibility = "hidden";
    }).catch(function (reason) {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
        pEditMessage.innerText = "Es ist ein Fehler aufgetreten: " + reason;
    });
}
function editAndDeleteUser(event) {
    // Event-Handler für die Edit and Delete-Buttons
    // -> Weiterleitung an editUser() und deleteUser
    var element = event.target;
    if (element.matches('.edit-user-button')) {
        openEditForm(event);
    }
    else if (element.matches('.delete-user-button')) {
        deleteUser(event);
    }
}
function openEditForm(event) {
    // formEditUser sichtbar machen & Daten des Users eintragen
    var formEditUser = document.getElementById("formEditUser");
    var inputVorname = document.getElementById("editVorname");
    var inputNachname = document.getElementById("editNachname");
    var inputEmail = document.getElementById("editEmail");
    var inputId = document.getElementById("editId");
    var btn = event.target;
    // Id ermitteln: erste 4 Zeichen abschneiden ("edit0" -> 0)
    var id = btn.id.substr(4);
    axios.get("/user/" + id).then(function (value) {
        // formEditUser sichtbar machen & Daten des Users eintragen
        formEditUser.style.visibility = "visible";
        inputVorname.value = value.data['vorname'];
        inputNachname.value = value.data['nachname'];
        inputEmail.value = value.data['email'];
        inputId.value = value.data['userid'];
    }).catch(function (reason) {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
    });
}
function deleteUser(event) {
    //User löschen und Tabelleninhalt aktualisieren -> DELETE /user/:id
    var btn = event.target;
    var id = btn.id.substr(6);
    axios.delete('user/' + id)
        .then(function (value) {
        updateUserList();
    }).catch(function (reason) {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
    });
}
function updateUserList() {
    // User-Liste anfordern und damit den Tabellen-Inhalt updaten -> GET /users
    var tableUserList = document.getElementById("tableUserList");
    var userTableBody;
    var new_tbody = document.createElement('tbody');
    new_tbody.id = 'tbody';
    var row;
    var td1, td2, td3, td4, td5;
    axios.get('/users')
        .then(function (value) {
        for (var i = 0; i < value.data.length; i++) {
            td1 = document.createElement('td');
            td2 = document.createElement('td');
            td3 = document.createElement('td');
            td4 = document.createElement('td');
            td5 = document.createElement('td');
            td5.innerHTML = value.data[i]["userid"].toString();
            td1.innerHTML = value.data[i]["vorname"];
            td2.innerHTML = value.data[i]["nachname"];
            td3.innerHTML = value.data[i]["email"];
            td4.innerHTML = "<td>\n" +
                "                 <button id='edit" + value.data[i]['userid'] + "' type=\"button\" class=\"btn btn-secondary btn-sm edit-user-button\">Edit</button>\n" +
                "                 <button id='delete" + value.data[i]['userid'] + "' type=\"button\" class=\"btn btn-danger btn-sm delete-user-button\">Delete</button>\n" +
                "            </td>";
            row = new_tbody.insertRow();
            row.appendChild(td5);
            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);
        }
        var old_tbody = document.getElementById('tbody');
        tableUserList.replaceChild(new_tbody, old_tbody);
        userTableBody = document.getElementById("tbody");
        userTableBody.addEventListener('click', editAndDeleteUser);
    }).catch(function (reason) {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
        console.log(reason.message);
        console.log(reason.config);
    });
}
