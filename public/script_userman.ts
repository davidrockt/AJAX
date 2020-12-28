// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen...
// import axios, {AxiosResponse} from "axios";

const tableUserList: HTMLTableElement = document.getElementById("tableUserList") as HTMLTableElement;
const formNeuerUser: HTMLFormElement = document.getElementById("formNeuerUser") as HTMLFormElement;
const formEditUser: HTMLFormElement = document.getElementById("formEditUser") as HTMLFormElement;
let editButtons: HTMLButtonElement[] = [];
let deleteButtons: HTMLButtonElement[] = [];

document.addEventListener("DOMContentLoaded", () => {

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
            // Neue Reihe in die User-Tabelle einfügen
            appendNewRow(value.data, tableUserList);

            // Edit- und Delete-Button mit EventListener ausstatten
            newEditButton = document.getElementById('btnEdit' + value.data['userid']) as HTMLButtonElement;
            newEditButton.addEventListener('click', editUser);
            editButtons.push(newEditButton);
            newDeleteButton = document.getElementById('btnDelete' + value.data['userid']) as HTMLButtonElement;
            newDeleteButton.addEventListener('click', deleteUser);
            deleteButtons.push(newDeleteButton);

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

        axios.post("/edituser", {
            "vorname": data.get("editVorname"),
            "nachname": data.get("editNachname"),
            "passwort": data.get("editPasswort"),
            "id": data.get("editId")
        }).then((value: AxiosResponse) => {
            /**
             *  TODO Tabellen-Reihe mit geänderten Werten aktualisieren
             */

            // Form wieder verbergen
            formEditUser.style.visibility = "hidden";
        }).catch((reason: any) => {
            console.log("Es ist ein Fehler aufgetreten: " + reason);
        });
    });
});

function editUser(event: Event) {
    let btn: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
    // Id ermitteln: erste 7 Zeichen abschneiden ("btnEdit0" -> 0)
    let id: number = btn.id.substr(7) as unknown as number;
    /**
     * TODO Werte inkl id in die Form schreiben
     */
    formEditUser.style.visibility = "visible";
}

function deleteUser(event: Event) {
    console.log("Delete Function");
    let btn: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
    let id: number = btn.id.substr(9) as unknown as number;
    axios.post('deleteUser', {
        'id': id
    }).then(function (value) {

    }).catch(function (reason) {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
    });
}

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