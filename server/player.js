class Player {
    constructor(sock, n, c) {
        this.socket = sock;
        this.name = n;
        this.color = c;
        this.isAlive = true;
    }

    setRole(r) {
        this.role = r;
    }

    setSocket(sock) {
        this.socket = sock;
    }

    isRole(r) {
        return this.role === r;
    }

    serialize() {
        return {
            name: this.name,
            color: this.color,
            isAlive: this.isAlive,
        }
    }
}

export default Player;