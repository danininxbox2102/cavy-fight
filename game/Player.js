export class CavyFightPlayer {

    id;
    ip;
    loggedIn = false;

    constructor(id, ip) {
        this.id = id;
        this.ip = ip;
        this.loggedIn = false;
    }

    getId(){
        return this.id;
    }

    getIp(){
        return this.ip;
    }

    setIsLoggedIn(val){
        this.loggedIn = val;
    }

    isLoggedIn(){
        return this.loggedIn;
    }

}