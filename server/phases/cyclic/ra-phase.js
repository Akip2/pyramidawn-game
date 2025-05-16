import Phase from "../phase.js";
import {ROLES} from "../../const.js";
import {capitalizeFirstLetter} from "../../utils.js";

export default class RaPhase extends Phase {
    constructor(requestSender, playerManager, game) {
        super(requestSender, 30, capitalizeFirstLetter(ROLES.RA));
        this.game = game;
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const concernedPlayer = this.playerManager.getPlayerByRole(ROLES.RA);

        this.playerManager.addActivePlayerId(concernedPlayer.id);
        this.playerManager.playerAction(concernedPlayer, 1);
    }

    isValid() {
        const concernedPlayer = this.playerManager.getPlayerByRole(ROLES.RA);
        return concernedPlayer != null && concernedPlayer.isAlive;
    }
}