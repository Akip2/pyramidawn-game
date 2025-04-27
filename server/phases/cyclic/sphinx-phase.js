import Phase from "../phase.js";
import {ROLES} from "../../const.js";
import {capitalizeFirstLetter} from "../../utils.js";

export default class SphinxPhase extends Phase {
    constructor(requestSender, playerManager, game) {
        super(requestSender, 30, capitalizeFirstLetter(ROLES.SPHINX));
        this.playerManager = playerManager;
        this.game = game;
    }

    execute() {
        super.execute();
        const concernedPlayer = this.playerManager.getPlayerByRole(ROLES.SPHINX);

        const lastProtectedPlayer = this.game.protectedPlayer;
        const unselectableColors = lastProtectedPlayer ? [lastProtectedPlayer.color] : [];
        this.playerManager.playerAction(concernedPlayer, 1,  unselectableColors);
    }

    isValid() {
        const concernedPlayer = this.playerManager.getPlayerByRole(ROLES.SPHINX);
        return concernedPlayer != null && concernedPlayer.isAlive;
    }
}