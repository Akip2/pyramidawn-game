import Phase from "../phase.js";

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

        while (playerIndex < this.playerManager.getPlayerNb()) {
            const roleIndex = Math.floor(Math.random() * remainingRoles.length);
            const role = remainingRoles.splice(roleIndex, 1)[0];
            const player = this.playerManager.players[playerIndex];

            player.setRole(role);
            this.requestSender.send("role", role, player.id);
            playerIndex++;
        }

        const livingPlayers = this.playerManager.getLivingPlayers();
        this.playerManager.disableChat(livingPlayers);
    }
}