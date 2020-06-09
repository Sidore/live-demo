import * as express from "express";
import * as path from "path";
import * as socketServer from "socket.io";

const extraPass = __dirname.indexOf("distServer") === -1 ? "../" : "";

const server = express();
server.use(express.json());


server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

server.use("/dist", express.static(path.join(__dirname, `${extraPass}../dist`)));
server.use("/public", express.static(path.join(__dirname, `${extraPass}../public`)));
server.get("/", (req: express.Request, res: express.Response) => {
    return res.sendFile(path.join(__dirname, `${extraPass}../dist`, 'index.html'));
})

const PORT = process.env.PORT || 3333
const httpServer = server.listen(PORT, () => {
    console.log("run on port " + PORT)
})
const io = socketServer(httpServer);

let controllerInc = 1,
displayInc = 1;

const collection = {
    controllers: [],
    displays: []
}

const dashboards = [];

for(let i=0; i< 10; i++) {
    dashboards.push({
        id: i,
        displayName: `Board ${i}`,
        embedUrl: i % 2 === 0 ? "https://www.youtube.com/embed/oYFTWuRwpJE" : "https://www.youtube.com/embed/meC1JsHF9hk"
    })
}

io.on("connection", (socket) => {
    // socket.on("start", ({ multiplayer }) => {})
    socket.emit("message", "hello");

    socket.on("typechose", (type) => {
        if (type === 'display') {

            collection.displays.push({
                socket,
                id: displayInc++,
                board: null
            })

            socket.emit("type", type);
            socket.emit("id", displayInc - 1)

        } else if( type === 'controller') {

            collection.controllers.push({
                socket,
                id: controllerInc++
            })

            socket.emit("type", type);
        }

        let hotdata = {
            dashboards: dashboards.map((d) => d.displayName),
            screens: collection.displays.map((d) => ({id:d.id, dashboard: d.dashboard}))
        }

        collection.controllers.forEach((c) => {
            c.socket.emit("ctrlData", hotdata)
        })
    })

    socket.on("moveBoard", ({dashboard, screen}) => {

        console.log(dashboard, screen)
        const scr = collection.displays.find((s) => s.id == screen.id);
        const brd = dashboards.find((d) => d.displayName == dashboard)
        scr.socket.emit("dashboard",brd.embedUrl);

        scr.dashboard = brd.displayName;

        let hotdata = {
            dashboards: dashboards.map((d) => d.displayName),
            screens: collection.displays.map((d) => ({id:d.id, dashboard: d.dashboard}))
        }

        collection.controllers.forEach((c) => {
            c.socket.emit("ctrlData", hotdata)
        })        
    })

});