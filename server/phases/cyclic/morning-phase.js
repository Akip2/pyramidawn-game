import Phase from "../phase.js";
import {wait} from "../../utils.js";

export default class MorningPhase extends Phase {
    constructor(requestSender, playerManager, game) {
        super(requestSender, 10, "Morning");
        this.game = game;
        this.playerManager = playerManager;
    }

    async execute() {
        super.execute();

        await wait(2.5);

        const victimsColors = this.game.getVoteResult();

        if(victimsColors.length > 0) {
            let victimColor;

            if(victimsColors.length > 1) {
                victimColor = victimsColors[Math.floor(Math.random() * victimsColors.length)];
            } else {
                victimColor = victimsColors[0];
            }

            if(this.game.protectedPlayer === null || this.game.protectedPlayer.color !== victimColor) { //Killing player only if he wasn't protected by golem
                this.playerManager.kill(victimColor, "killed during the night");
                await wait(4.5);
            }
        }

        if(this.game.chosenAvatar) {
            this.playerManager.summon(this.game.chosenAvatar, this.game.dayCount % 2);
        }

        this.game.newDay();
    }
}