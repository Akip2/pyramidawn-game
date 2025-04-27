import Phase from "../phase.js";
import {ROLES} from "../../const.js";
import {capitalizeFirstLetter} from "../../utils.js";

export default class SphinxPhase extends Phase {
    constructor(requestSender, playerManager) {
        super(requestSender, 30, capitalizeFirstLetter(ROLES.SPHINX));
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const concernedPlayer = this.playerManager.getPlayerByRole(ROLES.SPHINX);
        this.playerManager.playerAction(concernedPlayer, 1);
    }

    isValid() {
        const concernedPlayer = this.playerManager.getPlayerByRole(ROLES.SPHINX);
        return concernedPlayer != null && concernedPlayer.isAlive;
    }
}