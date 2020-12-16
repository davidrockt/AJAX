// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen...
// import axios, {AxiosResponse} from "axios";
document.addEventListener("DOMContentLoaded", function () {
    var out = document.getElementById("out");
    var echo = document.getElementById("echo");
    var module = document.getElementById("module");
    echo.addEventListener("submit", function (event) {
        event.preventDefault();
        // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
        var data = new FormData(echo);
        // Ein POST-Request wird an /echo adressiert und das (typenlose) Objekt {"in":"wert"} als Daten gesendet
        // Die anonymen Callbackfunktionen für then oder catch werden nach dem Eingang eines Responses aufgerufen
        axios.post("/echo", {
            "in": data.get("in")
        }).then(function (value) {
            out.innerText = value.data;
        }).catch(function (reason) {
            out.innerText = "Es ist ein Fehler aufgetreten: " + reason;
        });
    });
    module.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = new FormData(module);
        // Der GET-Request kommt ohne Daten aus, schickt aber den Parameter als direkten Teil der URL mit (z.B. /model/5)
        axios.get("/module/" + data.get("nr"))
            .then(function (value) {
            out.innerText = value.data;
        }).catch(function (reason) {
            out.innerText = "Es ist ein Fehler aufgetreten: " + reason;
        });
    });
});
