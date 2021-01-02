// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen...
import axios, {AxiosResponse} from "axios";

/*****************************************************************************
 * Main Callback: Wait for DOM to be fully loaded                            *
 *****************************************************************************/
document.addEventListener("DOMContentLoaded", () => {
    let userTableBody: HTMLBodyElement = document.getElementById("tbody") as HTMLBodyElement;
    const formNeuerUser: HTMLFormElement = document.getElementById("formNeuerUser") as HTMLFormElement;
    const formEditUser: HTMLFormElement = document.getElementById("formEditUser") as HTMLFormElement;

    userTableBody.addEventListener('click', editAndDeleteUser);
    formNeuerUser.addEventListener("submit", addUser);
    formEditUser.addEventListener("submit", editUser);
});

/*****************************************************************************
 * Event Handlers (callbacks)                                                *
 *****************************************************************************/
function addUser(event: Event) {
    const formNeuerUser: HTMLFormElement = document.getElementById("formNeuerUser") as HTMLFormElement;
    event.preventDefault();
    // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
    const data: FormData = new FormData(formNeuerUser);

    axios.post("/neueruser", {
        "vorname": data.get("inputVorname"),
        "nachname": data.get("inputNachname"),
        "email": data.get("inputEmail"),
        "passwort": data.get("inputPasswort")
    }).then(() => {
        // Tabelle aktualisieren
        updateUserList();
        // Form-Inhalte zurücksetzen
        formNeuerUser.reset();
    }).catch((reason: any) => {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
    });
}

function editUser(event: Event) {
    const formEditUser: HTMLFormElement = document.getElementById("formEditUser") as HTMLFormElement;
    const pEditMessage: HTMLParagraphElement = document.getElementById("edit-message") as HTMLParagraphElement;
    event.preventDefault();

    // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
    const data: FormData = new FormData(formEditUser);

    axios.put("/user/" + data.get("editId"), {
        "vorname": data.get("editVorname"),
        "nachname": data.get("editNachname"),
        "passwort": data.get("editPasswort"),
        "email": data.get("editEmail")
    }).then(() => {
        updateUserList();
        // Form wieder verbergen
        formEditUser.style.visibility = "hidden";
    }).catch((reason: any) => {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
        pEditMessage.innerText = "Es ist ein Fehler aufgetreten: " + reason;
    });
}

function editAndDeleteUser(event: Event) {
    let element = event.target as HTMLElement;
    if (element.matches('.edit-user-button')) {
        openEditForm(event);
    } else if (element.matches('.delete-user-button')) {
        deleteUser(event);
    }
}

function openEditForm(event: Event) {
    const formEditUser: HTMLFormElement = document.getElementById("formEditUser") as HTMLFormElement;
    const inputVorname: HTMLInputElement = document.getElementById("editVorname") as HTMLInputElement;
    const inputNachname: HTMLInputElement = document.getElementById("editNachname") as HTMLInputElement;
    const inputEmail: HTMLInputElement = document.getElementById("editEmail") as HTMLInputElement;
    const inputId: HTMLInputElement = document.getElementById("editId") as HTMLInputElement;
    let btn: HTMLButtonElement = event.target as HTMLButtonElement;

    // Id ermitteln: erste 4 Zeichen abschneiden ("edit0" -> 0)
    let id: number = btn.id.substr(4) as unknown as number;

    axios.get("/user/" + id).then((value: AxiosResponse) => {
        formEditUser.style.visibility = "visible";
        inputVorname.value = value.data['vorname'];
        inputNachname.value = value.data['nachname'];
        inputEmail.value = value.data['email'];
        inputId.value = value.data['userid'];
    }).catch((reason: any) => {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
    });
}

function deleteUser(event: Event) {
    let btn: HTMLButtonElement = event.target as HTMLButtonElement;
    let id: number = btn.id.substr(6) as unknown as number;
    axios.delete('delete/' + id)
        .then((value) => {
            console.log("Deleted:")
            console.log(value.data);
            updateUserList();
        }).catch(function (reason) {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
    });
}

/*****************************************************************************
 * Render functions                                                          *
 *****************************************************************************/
function updateUserList() {
    const tableUserList: HTMLTableElement = document.getElementById("tableUserList") as HTMLTableElement;
    let userTableBody: HTMLBodyElement;
    let new_tbody = document.createElement('tbody');
    new_tbody.id = 'tbody';
    let row: HTMLTableRowElement;
    let td1, td2, td3, td4, td5: HTMLTableDataCellElement;

    axios.get('/users')
        .then(value => {
            for (let i = 0; i < value.data.length; i++) {
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
                    "            </td>"
                row = new_tbody.insertRow();
                row.appendChild(td5);
                row.appendChild(td1);
                row.appendChild(td2);
                row.appendChild(td3);
                row.appendChild(td4);

            }
            let old_tbody = document.getElementById('tbody');
            tableUserList.replaceChild(new_tbody, old_tbody);
            userTableBody = document.getElementById("tbody") as HTMLBodyElement;
            userTableBody.addEventListener('click', editAndDeleteUser);
        }).catch((reason: any) => {
        console.log("Es ist ein Fehler aufgetreten: " + reason);
        console.log(reason.message);
        console.log(reason.config);
    });
}