export default class Player {
    constructor(id, n, c) {
        this.id = id;
        this.name = n;
        this.color = c;
        this.isAlive = true;
    }

    setRole(r) {
        this.role = r;
    }

    becomeAvatar(godName) {
        this.isAvatarOf = godName;
    }

    isGod(godName) {
        return this.isAvatarOf === godName;
    }

    isRole(r) {
        return this.role === r;
    }

    die() {
        this.isAlive = false;
    }

    serialize() {
        return {
            name: this.name,
            color: this.color,
            isAlive: this.isAlive,
        }
    }
}