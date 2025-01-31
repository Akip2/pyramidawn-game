class PlayerData {
    name: string;
    color: string;
    isAlive: boolean;

    constructor(name: string, color: string, isAlive: boolean = true) {
        this.name = name;
        this.color = color;
        this.isAlive = isAlive;
    }
}

export default PlayerData;