import Phase from "../phase.js";
import {isRoleMummy} from "../../utils.js";

export default class RolePhase extends Phase {
    constructor(requestSender, playerManager, roles) {
        super(requestSender, 15, "Role");
        this.playerManager = playerManager;
        this.roles = roles;
    }

    execute() {
        super.execute();
        const remainingRoles = [...this.roles];

        let playerIndex = 0;

        const mummies = [];
        while (playerIndex < this.playerManager.getPlayerNb()) {
            const roleIndex = Math.floor(Math.random() * remainingRoles.length);
            const role = remainingRoles.splice(roleIndex, 1)[0];
            const player = this.playerManager.players[playerIndex];

            player.setRole(role);
            this.requestSender.assignRoleToPlayer(role, player.id);
            playerIndex++;

            if(isRoleMummy(role)) {
                mummies.push(player);
            }
        }

        this.requestSender.informMummies(mummies);

        const livingPlayers = this.playerManager.getLivingPlayers();
        this.playerManager.disableChat(livingPlayers);
    }
}