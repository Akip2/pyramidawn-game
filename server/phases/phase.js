export default class Phase {
    constructor(requestSender, duration, name) {
        this.duration = duration;
        this.name = name;
        this.requestSender = requestSender;
    }

    execute() {
        this.requestSender.send("phase-change", this.serialize());
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