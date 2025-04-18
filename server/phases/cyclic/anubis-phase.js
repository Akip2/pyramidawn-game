import Phase from "../phase.js";
import {GODS} from "../../const.js";

export default class AnubisPhase extends Phase {
    constructor(requestSender, playerManager) {
        super(requestSender, 30, "Anubis");
        this.playerManager = playerManager;
    }

    async execute() {
        super.execute();

        const anubis = this.playerManager.getAvatarOf(GODS[0]);
        this.playerManager.godAction(anubis);
    }

    isValid() {
        return this.playerManager.getAvatarOf(GODS[0]);
    }
}