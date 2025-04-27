import Phase from "../phase.js";
import {capitalizeFirstLetter} from "../../utils.js";
import {ROLES} from "../../const.js";

export default class MummyPhase extends Phase {
    constructor(requestSender, playerManager) {
        super(requestSender, 1, capitalizeFirstLetter(ROLES.MUMMY));
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const mummies = this.playerManager.getEvilPlayers();
        this.playerManager.allowVote(mummies);
        this.playerManager.allowChat(mummies);
    }

    isValid() {
        const mummies = this.playerManager.getEvilPlayers();
        return mummies.length > 0;
    }
}