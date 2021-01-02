import * as express from "express";
import {json} from "express";

const app: express.Express = express();
let idxUser: number = 0;
class User {
    constructor(vorname: string, nachname: string, email: string, passwort: string) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.passwort = passwort;
        this.userid = idxUser;
        idxUser++;
    }
    vorname: string; nachname: string; email: string; passwort: string; userid: number;
    editUser(vorname: string, nachname: string, passwort: string) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.passwort = passwort;
    }
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

app.get("/users", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.contentType("application/json");
    res.send(JSON.stringify(userList));
});

// TODO Korrekte Status-Codes!
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

app.post("/edituser", (req: express.Request, res: express.Response) => {
    console.log(req.body);
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;
    const email: string = req.body.email;
    const passwort: string = req.body.passwort;
    let editedUser: User;
    for(let user of userList) {
        if(user.email == email) editedUser = user;
    }
    if(editedUser !== undefined) {
        editedUser.editUser(vorname, nachname, passwort);
        res.status(200);
        res.contentType("application/json");
        res.send(JSON.stringify(editedUser));
    } else {
        // console.log("email = " + email);
        // TODO Fehlermeldung schicken
        res.status(404).send("User with email " + email + " undefined");
    }
});

app.delete("/delete/:id", (req: express.Request, res: express.Response) => {
    const id: number = Number(req.params.id);
    let idxUser: number;
    for (let user of userList) {
        if(user.userid == id) idxUser = userList.indexOf(user);
    }
    if(idxUser !== undefined) {
        res.contentType("application/json");
        res.send(JSON.stringify(userList[idxUser]));
        userList.splice(idxUser, 1);
        res.status(200);
    } else {
        // TODO Fehlermeldung schicken
        res.sendStatus(404);
    }
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
// welcher Datentyp ist JSON? Object?
// Debuggen ??

// TODO
// Error-Handling (Kein User mit dieser Email usw)