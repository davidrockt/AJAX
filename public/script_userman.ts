// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen...
// import axios, {AxiosResponse} from "axios";

document.addEventListener("DOMContentLoaded", () => {
    const out: HTMLElement = document.getElementById("out");
    const tableUserList: HTMLTableElement = document.getElementById("tableUserList") as HTMLTableElement;
    const formNeuerUser: HTMLFormElement = document.getElementById("formNeuerUser") as HTMLFormElement;

    formNeuerUser.addEventListener("submit", (event: Event) => {
        event.preventDefault();
        // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
        const data: FormData = new FormData(formNeuerUser);
        console.log(data);

        // Ein POST-Request wird an /echo adressiert und das (typenlose) Objekt {"in":"wert"} als Daten gesendet
        // Die anonymen Callbackfunktionen für then oder catch werden nach dem Eingang eines Responses aufgerufen
        axios.post("/neueruser", {
            "vorname": data.get("inputVorname"),
            "nachname": data.get("inputNachname"),
            "email": data.get("inputEmail"),
            "passwort": data.get("inputPasswort")
        }).then((value: AxiosResponse) => {
            console.log("Response data:")
            console.log(value.data);
            // out.innerText = value.data[0]["vorname"];
            let row: HTMLTableRowElement = tableUserList.insertRow(-1);
            let td1: HTMLTableDataCellElement = document.createElement('td');
            let td2: HTMLTableDataCellElement = document.createElement('td');
            let td3: HTMLTableDataCellElement = document.createElement('td');
            let td4: HTMLTableDataCellElement = document.createElement('td');
            td1.innerHTML = value.data["vorname"];
            td2.innerHTML = value.data["nachname"];
            td3.innerHTML = value.data["email"];
            td4.innerHTML = "<td>\n" +
                "                 <button type=\"button\" class=\"btn btn-secondary btn-sm\">Edit</button>\n" +
                "                 <button type=\"button\" class=\"btn btn-danger btn-sm\">Delete</button>\n" +
                "            </td>"
            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);

            formNeuerUser.reset();
        }).catch((reason: any) => {
            out.innerText = "Es ist ein Fehler aufgetreten: " + reason;
        });
    });
});