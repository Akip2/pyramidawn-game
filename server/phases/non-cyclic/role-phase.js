import Phase from "../cyclic/phase.js";

export default class RolePhase extends Phase {
    constructor(room) {
        super(room, 15, "Role");
    }

    execute() {
        super.execute();
        const remainingRoles = this.room.roles;

        let playerIndex = 0;

        while (playerIndex < this.room.players.length) {
            const roleIndex = Math.floor(Math.random() * remainingRoles.length);
            const role = remainingRoles.splice(roleIndex, 1)[0];
            const player = this.room.players[playerIndex];

            player.setRole(role);
            this.room.send("role", role, player.id);
            playerIndex++;
        }
    }
}