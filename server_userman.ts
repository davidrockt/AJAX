import * as express from "express";
import {json} from "express";

const app: express.Express = express();
class User {
    constructor(vorname: string, nachname: string, email: string, passwort: string) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.passwort = passwort;
    }
    vorname: string; nachname: string; email: string; passwort: string;
}

let userList: User[] = [];

app.listen(8080, () => {
    console.log("Verbunden auf http://localhost:8080");
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/res", express.static(__dirname + "/public"));
app.use("/dependency", express.static(__dirname + "/node_modules"));

app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/userman.html");
});

app.post("/neueruser", (req: express.Request, res: express.Response) => {
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;
    const email: string = req.body.email;
    const passwort: string = req.body.passwort;
    const user = new User(vorname, nachname, email, passwort);
    userList.push(user);
    res.status(200);
    res.contentType("application/json");
    res.send(JSON.stringify(user));
});

app.get("/module/:nr", (req: express.Request, res: express.Response) => {
    const nr: number = Number(req.params.nr);
    const module: string[] = ["OOP", "DM", "AuD", "GDI", "WBS", "LA"];

    if(module[nr] !== undefined) {
        res.status(200);
        res.send(module[nr]);
    } else {
        res.sendStatus(404);
    }
});

// Warum bei getElementById "as HTML..." ?
