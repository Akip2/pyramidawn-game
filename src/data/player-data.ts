export default class PlayerData {
    name: string;
    color: string;
    isAlive: boolean;
    isAvatarOf: string | null;
    isWraith: boolean = false;

    constructor(name: string, color: string, isAlive: boolean = true) {
        this.name = name;
        this.color = color;
        this.isAlive = isAlive;
        this.isAvatarOf = null;
    }
}