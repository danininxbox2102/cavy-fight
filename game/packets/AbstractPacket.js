export class AbstractPacket {

    type;
    clazz;

    constructor(type) {
        this.type = type;
    }

    getType(){
        return this.type;
    }

    toString(){
        const data = {type: this.type, clazz: this.clazz};
        data.payload = this.getPayload();
        return JSON.stringify(data);
    }

    getPayload(){}

    static fromJSON(payload){
        return Object.assign(new this(), payload);
    }
}