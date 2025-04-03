import Phase from "../phase.js";

export default class MorningPhase extends Phase {
    constructor(requestSender, game, playerManager) {
        super(requestSender, 300, "Morning");
        this.game = game;
        this.playerManager = playerManager;
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

            this.playerManager.kill(victimColor, "killed during the night");
        }
    }
}