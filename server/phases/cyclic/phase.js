export default class Phase {
    constructor(room, duration, name) {
        this.room = room;
        this.duration = duration;
        this.name = name;
    }

    execute() {
        this.room.send("phase-change", this.serialize());
        this.room.startPhaseTimer(this.duration);
    }

    isValid() {
        return true;
    }

    serialize() {
        return {
            name: this.name,
            duration: this.duration,
        }
    }
}