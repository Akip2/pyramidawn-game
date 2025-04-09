import Phase from "../phase.js";

export default class VotePhase extends Phase {
    constructor(requestSender, playerManager) {
        super(requestSender, 20, "Vote");
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const playersAlive = this.playerManager.getLivingPlayers();
        this.playerManager.allowVote(playersAlive);
    }
}