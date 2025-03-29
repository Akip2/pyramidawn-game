import Phase from "../cyclic/phase.js";

export default class RolePhase extends Phase {
    constructor(room, playerManager) {
        super(room, 15, "Role");
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const remainingRoles = this.room.roles;

        let playerIndex = 0;

        while (playerIndex < this.playerManager.getPlayerNb()) {
            const roleIndex = Math.floor(Math.random() * remainingRoles.length);
            const role = remainingRoles.splice(roleIndex, 1)[0];
            const player = this.playerManager.players[playerIndex];

            player.setRole(role);
            this.room.send("role", role, player.id);
            playerIndex++;
        }
    }
}