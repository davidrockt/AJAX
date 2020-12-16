// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen...
// import axios, {AxiosResponse} from "axios";

document.addEventListener("DOMContentLoaded", () => {
    const out: HTMLElement = document.getElementById("out");
    const echo: HTMLFormElement = document.getElementById("echo") as HTMLFormElement;
    const module: HTMLFormElement = document.getElementById("module") as HTMLFormElement;

    echo.addEventListener("submit", (event: Event) => {
        event.preventDefault();
        // Die Daten des gesamten Formulars werden in dem FormData-Objekt gesammelt
        const data: FormData = new FormData(echo);

        // Ein POST-Request wird an /echo adressiert und das (typenlose) Objekt {"in":"wert"} als Daten gesendet
        // Die anonymen Callbackfunktionen für then oder catch werden nach dem Eingang eines Responses aufgerufen
        axios.post("/echo", {
            "in": data.get("in")
        }).then((value: AxiosResponse) => {
            out.innerText = value.data;
        }).catch((reason: any) => {
            out.innerText = "Es ist ein Fehler aufgetreten: " + reason;
        });
    });

    module.addEventListener("submit", (event: Event) => {
        event.preventDefault();
        const data: FormData = new FormData(module);

        // Der GET-Request kommt ohne Daten aus, schickt aber den Parameter als direkten Teil der URL mit (z.B. /model/5)
        axios.get("/module/" + data.get("nr"))
            .then((value: AxiosResponse) => {
                out.innerText = value.data;
            }).catch((reason: any) => {
            out.innerText = "Es ist ein Fehler aufgetreten: " + reason;
        });
    });
});