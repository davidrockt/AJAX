// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen...
// import axios, {AxiosResponse} from "axios";

/*class User {
    constructor(vorname: string, nachname: string, email: string, passwort: string) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.passwort = passwort;
    }
    vorname: string; nachname: string; email: string; passwort: string;
}

let userList: User[];*/

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
            console.log(value.data);
            out.innerText = value.data;
            // userList.push(new User())
        }).catch((reason: any) => {
            out.innerText = "Es ist ein Fehler aufgetreten: " + reason;
        });
    });
});