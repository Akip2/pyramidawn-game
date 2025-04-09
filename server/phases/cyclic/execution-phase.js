import Phase from "../phase.js";
import {wait} from "../../utils.js";

export default class ExecutionPhase extends Phase {
    constructor(requestSender, playerManager, game) {
        super(requestSender, 15, "Execution");
        this.playerManager = playerManager;
        this.game = game;
    }

    async execute() {
        super.execute();

        const voted = this.game.getVoteResult();

        if(voted.length > 0) {
            let victimColor;
            if (voted.length > 1) {
                this.requestSender.send("equality");
                await wait(4);
                victimColor = voted[Math.floor(Math.random() * voted.length)];
            } else {
                victimColor = voted[0];
            }

            this.playerManager.kill(victimColor, "executed by the village");
        } else {
            this.requestSender.send("no-death");
        }

        this.game.clearVotes();
    }
}