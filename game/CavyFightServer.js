import {WebSocketServer} from "ws";
import {verifyToken} from "../routers/AuthRouter.js";
import {CavyFightPlayer} from "./Player.js";
import {AuthPacket} from "./packets/imp/AuthPacket.js";
import {PacketHelper} from "./packets/PacketHelper.js";
import {PacketType} from "./packets/PacketRegistry.js";

export class CavyFightServer{

    _webSocketServer = null;
    _players = []


    constructor() {
    }

    initServer(){
        console.log("Initializing game server...");
        this.webSocketServer = new WebSocketServer({ port: 8080 });
        this.webSocketServer.on('connection', ws=> {
            this.onConnection(ws)
        });

        // const packet = new AuthPacket("thiIsVeryEncodedToken")
        // packet.aboba();
        // let pstring = packet.toString();
        // console.log("pstring: "+ pstring);
        // pstring = pstring.replace(PacketType.AUTH_PACKET,"aboba")
        // console.log("pstring2: "+ pstring);
        //
        // const packet2 = PacketHelper.decode(pstring);
        // packet2.aboba();
        // console.log("typeof packet2 "+ typeof packet2);
    }

    onConnection(ws){
        console.log("New connection | "+ws._socket.remoteAddress);

        ws.on('message', m => this.onMessage(ws,m.toString()));

        ws.on("error", e => ws.send(e));

        ws.on("close", ()=>{
            console.log("Connection closed | "+ws._socket.remoteAddress);
        })
    }

    onMessage(ws,msg){
        if (msg.toString().startsWith("auth")){
            const token = msg.split(" ")[1];
            if (!token){
                ws.send("error JWT Token is required");
                return;
            }
            let result = this.authPlayer(token,ws._socket.remoteAddress)
            if(result){
                ws.send("Successfully logged in!");
                return;
            }
            ws.send("Failed to log in");
        }
    }

    getPlayerById(id){
        return this._players.find(p => p.getId() === id)
    }

    getPlayerByIp(ip){
        return this._players.find(p => p.getIp() === ip)
    }

    createPlayer(id, ip){
        const player = new CavyFightPlayer(id)

        this._players.push(player)
    }

    authPlayer(token, ip){
        const result = verifyToken(token)
        if(!result.valid) {
            console.log("Failed to log in | e: "+result.error+" | ip: "+ip);
            return false;
        }

        console.log("Player "+result.data.id+" logged in | ip: "+ip);
        this.createPlayer(result.data.id, ip);
        return true;
    }

}