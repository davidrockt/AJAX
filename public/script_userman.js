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
document.addEventListener("DOMContentLoaded", function () {
    var out = document.getElementById("out");
    var tableUserList = document.getElementById("tableUserList");
    var formNeuerUser = document.getElementById("formNeuerUser");
    formNeuerUser.addEventListener("submit", function (event) {
        event.preventDefault();
        // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
        var data = new FormData(formNeuerUser);
        console.log(data);
        // Ein POST-Request wird an /echo adressiert und das (typenlose) Objekt {"in":"wert"} als Daten gesendet
        // Die anonymen Callbackfunktionen für then oder catch werden nach dem Eingang eines Responses aufgerufen
        axios.post("/neueruser", {
            "vorname": data.get("inputVorname"),
            "nachname": data.get("inputNachname"),
            "email": data.get("inputEmail"),
            "passwort": data.get("inputPasswort")
        }).then(function (value) {
            console.log(value.data);
            out.innerText = value.data;
            // userList.push(new User())
        }).catch(function (reason) {
            out.innerText = "Es ist ein Fehler aufgetreten: " + reason;
        });
    });
});
