import {AbstractPacket} from "../AbstractPacket.js";
import {PacketType} from "../PacketRegistry.js";

export class AuthPacket extends AbstractPacket {

    token;

    constructor(token) {
        super(PacketType.AUTH_PACKET);
        this.token = token;
    }

    aboba(){
        console.log("Bebra");
    }

    getPayload() {
        return {token: this.token};
    }
}