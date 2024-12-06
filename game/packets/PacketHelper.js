import {PacketType} from "./PacketRegistry.js";
import {AuthPacket} from "./imp/AuthPacket.js";

export class PacketHelper {

    static instanceByType(type){
        switch (type){
            case PacketType.AUTH_PACKET:
                return AuthPacket;
        }
    }

    static decode(packetString){
        const packetJSON = JSON.parse(packetString);
        if (packetJSON === {}){
            console.log("packetJSON is null");
            return null;
        }

        const packetType = packetJSON.type;

        if (!packetType){
            console.log("invalid packetType");
            return null;
        }

        const clazz = this.instanceByType(packetType);
        console.log("clazz", clazz);

        if (!clazz){
            console.log("invalid packetType");
            return null;
        }

        const packet = clazz.fromJSON(packetJSON.payload);

        console.log("packet: "+packet);

        return packet;

    }
}