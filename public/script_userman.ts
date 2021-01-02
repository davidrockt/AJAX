// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen...
import axios, {AxiosResponse} from "axios";

// Interface representing a user
interface User {
    vorname: string;
    nachname: string;
    email: string;
    passwort: string;
    userid: number;
}

document.addEventListener("DOMContentLoaded", () => {
    const tableUserList: HTMLTableElement = document.getElementById("tableUserList") as HTMLTableElement;
    let userTableBody: HTMLBodyElement = document.getElementById("tbody") as HTMLBodyElement;
    const formNeuerUser: HTMLFormElement = document.getElementById("formNeuerUser") as HTMLFormElement;
    const formEditUser: HTMLFormElement = document.getElementById("formEditUser") as HTMLFormElement;
    const pEditMessage: HTMLParagraphElement = document.getElementById("edit-message") as HTMLParagraphElement;

    userTableBody.addEventListener('click', editAndDeleteUser);

    formNeuerUser.addEventListener("submit", (event: Event) => {
        event.preventDefault();
        // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
        const data: FormData = new FormData(formNeuerUser);
        console.log(data);
        let newEditButton: HTMLButtonElement;
        let newDeleteButton: HTMLButtonElement;

        // Ein POST-Request wird an /echo adressiert und das (typenlose) Objekt {"in":"wert"} als Daten gesendet
        // Die anonymen Callbackfunktionen für then oder catch werden nach dem Eingang eines Responses aufgerufen
        axios.post("/neueruser", {
            "vorname": data.get("inputVorname"),
            "nachname": data.get("inputNachname"),
            "email": data.get("inputEmail"),
            "passwort": data.get("inputPasswort")
        }).then((value: AxiosResponse) => {
            // Tabelle aktualisieren
            updateUserList();
            // Form-Inhalte zurücksetzen
            formNeuerUser.reset();
        }).catch((reason: any) => {
            console.log("Es ist ein Fehler aufgetreten: " + reason);
        });
    });

    formEditUser.addEventListener("submit", (event: Event) => {
        event.preventDefault();
        // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
        const data: FormData = new FormData(formEditUser);
        /**
         *  TODO Formular mit Werten des Users ausfüllen
         */

        axios.post("/edituser", {
            "vorname": data.get("editVorname"),
            "nachname": data.get("editNachname"),
            "passwort": data.get("editPasswort"),
            "id": data.get("editId")
        }).then((value: AxiosResponse) => {
            updateUserList();
            // Form wieder verbergen
            formEditUser.style.visibility = "hidden";
        }).catch((reason: any) => {
            console.log("Es ist ein Fehler aufgetreten: " + reason);
            pEditMessage.innerText = "Es ist ein Fehler aufgetreten: " + reason;
        });
    });
});

function editAndDeleteUser(event: Event) {
    let element = event.target as HTMLElement;
    if (element.matches('.edit-user-button')) {
        console.log("Edit")
        editUser(event);
    } else if (element.matches('.delete-user-button')) {
        console.log("Delete")
        deleteUser(event);
    }
}

function renderUserList(userList: User[]) {
    const tableUserList: HTMLTableElement = document.getElementById("tableUserList") as HTMLTableElement;
    let userTableBody: HTMLBodyElement = document.getElementById("tbody") as HTMLBodyElement;
    // tableUserList.insertRow(-1);
    let new_tbody = document.createElement('tbody');
    new_tbody.id = 'tbody';
    let row: HTMLTableRowElement;
    let td1, td2, td3, td4: HTMLTableDataCellElement;
    for (let user of userList) {
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
            "            </td>"
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td4);
    }
    let old_tbody = document.getElementById('tbody');
    tableUserList.replaceChild(new_tbody, old_tbody);
    userTableBody = document.getElementById("tbody") as HTMLBodyElement;
    userTableBody.addEventListener('click', editAndDeleteUser);
}

function updateUserList() {
    axios.get('/users')
        .then(value => {
            console.log("/users Response: ");
            console.log(value.data);
            renderUserList(value.data);
        });
}

function editUser(event: Event) {
    const formEditUser: HTMLFormElement = document.getElementById("formEditUser") as HTMLFormElement;
    let btn: HTMLButtonElement = event.target as HTMLButtonElement;
    // Id ermitteln: erste 4 Zeichen abschneiden ("edit0" -> 0)
    let id: number = btn.id.substr(4) as unknown as number;
    /**
     * TODO Werte inkl id in die Form schreiben
     */
    formEditUser.style.visibility = "visible";
}

function deleteUser(event: Event) {
    let btn: HTMLButtonElement = event.target as HTMLButtonElement;
    let id: number = btn.id.substr(6) as unknown as number;
    console.log("Delete Function, id = " + btn.id);
    axios.delete('delete/' + id)
        .then((value) => {
            console.log("Deleted:")
            console.log(value.data);
            updateUserList();
    }).catch(function (reason) {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
    });
}

/*
function appendNewRow(data: any, tableUserList: HTMLTableElement) {
    let row: HTMLTableRowElement = tableUserList.insertRow(-1);
    let td1: HTMLTableDataCellElement = document.createElement('td');
    let td2: HTMLTableDataCellElement = document.createElement('td');
    let td3: HTMLTableDataCellElement = document.createElement('td');
    let td4: HTMLTableDataCellElement = document.createElement('td');
    td1.innerHTML = data["vorname"];
    td2.innerHTML = data["nachname"];
    td3.innerHTML = data["email"];
    td4.innerHTML = "<td>\n" +
        "                 <button id='btnEdit" + data['userid'] + "' type=\"button\" class=\"btn btn-secondary btn-sm\">Edit</button>\n" +
        "                 <button id='btnDelete" + data['userid'] + "'type=\"button\" class=\"btn btn-danger btn-sm\">Delete</button>\n" +
        "            </td>"
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
}
 */