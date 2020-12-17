import * as express from "express";

const router: express.Express = express();
router.listen(8000, () => {
    console.log("Verbunden auf http://localhost:8000");
});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.use("/res", express.static(__dirname + "/public"));
router.use("/dependency", express.static(__dirname + "/node_modules"));

router.get("/", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/index.html");
});

router.post("/echo", (req: express.Request, res: express.Response) => {
    const input: string = req.body.in;
    res.status(200);
    res.send("Echo: " + input);
});

router.get("/module/:nr", (req: express.Request, res: express.Response) => {
    const nr: number = Number(req.params.nr);
    const module: string[] = ["OOP", "DM", "AuD", "GDI", "WBS", "LA"];

    if(module[nr] !== undefined) {
        res.status(200);
        res.send(module[nr]);
    } else {
        res.sendStatus(404);
    }
});