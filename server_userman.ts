import * as express from "express";

const app: express.Express = express();
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
    const input: string = req.body.vorname;
    res.status(200);
    // res.contentType("application/json");
    // res.send({'user1': input});
    res.send("Echo: " + input);
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
