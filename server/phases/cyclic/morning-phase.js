import Phase from "./phase.js";

export default class MorningPhase extends Phase {
    constructor(room, game) {
        super(room, 300, "Morning");
        this.game = game;
    }

    execute() {
        super.execute();

        const victimsColors = this.game.getVoteResult();

        if(victimsColors.length > 0) {
            let victimColor;

            if(victimsColors.length > 1) {
                victimColor = victimsColors[Math.floor(Math.random() * victimsColors.length)];
            } else {
                victimColor = victimsColors[0];
            }

            this.room.kill(victimColor, "killed during the night");
        }
    }
}