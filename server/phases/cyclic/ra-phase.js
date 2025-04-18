import Phase from "../phase.js";
import {GODS} from "../../const.js";

export default class RaPhase extends Phase {
    constructor(requestSender, playerManager) {
        super(requestSender, 30, "Ra");
        this.playerManager = playerManager;
    }

    async execute() {
        super.execute();

        const ra = this.playerManager.getAvatarOf(GODS[1]);
        this.playerManager.godAction(ra);
    }

    isValid() {
        return this.playerManager.getAvatarOf(GODS[1]);
    }
}