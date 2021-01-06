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
    vorname: string; nachname: string; email: string; private passwort: string; userid: number;
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

app.post("/neueruser", (req: express.Request, res: express.Response) => {
    // TODO Email existiert schon?
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;
    const email: string = req.body.email;
    const passwort: string = req.body.passwort;

    // Leere und undefinierte Strings ablehnen
    if(vorname && nachname && email && passwort
        && vorname.trim() !== '' && nachname.trim() !== '' && email.trim() !== '' && passwort.trim() !== '') {
        const user = new User(vorname, nachname, email, passwort);
        userList.push(user);
        res.status(200);
        res.contentType("application/json");
        res.send(JSON.stringify(userList));
    } else {
        res.status(404);
        res.send("Reqest enthält ungültige Attribute");
    }
});

app.put("/user/:id", (req: express.Request, res: express.Response) => {
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;
    const email: string = req.body.email;
    const passwort: string = req.body.passwort;
    let editedUser: User;
    for(let user of userList) {
        if(user.userid.toString() == req.params.id) editedUser = user;
    }
    if(editedUser !== undefined) {
        editedUser.editUser(vorname, nachname, passwort);
        res.status(200);
        res.contentType("application/json");
        res.send(JSON.stringify(editedUser));
    } else {
        res.status(404);
        res.send("User with email '" + email + "' undefined");
    }
});

app.get("/user/:id", (req: express.Request, res: express.Response) => {
    const id: number = Number(req.params.id);
    let editedUser: User;
    for(let user of userList) {
        if(user.userid == id) editedUser = user;
    }
    if(editedUser !== undefined) {
        res.status(200);
        res.contentType("application/json");
        res.send(JSON.stringify(editedUser));
    } else {
        res.status(404);
        res.send("User with id " + id + " undefined");
    }
});

app.delete("/user/:id", (req: express.Request, res: express.Response) => {
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
        console.log("Could not delete user with id '" + id + "'");
        res.sendStatus(204);
    }
});

// Warum bei getElementById "as HTML..." ?
// welcher Datentyp ist JSON? Object?
// Debuggen ??
// Muss '/neueruser' in Wirklichkeit '/user/:id' sein? -> nein
// Ordner-Struktur -> siehe Vorgabe von Manuel Groh
// bei get("/user/:id") gleichzeit :id und req.param
// Fehlermeldung des Servers wie zum Client schicken? (zb res.status(404).send("User with id " + id + " undefined") )

// TODO
