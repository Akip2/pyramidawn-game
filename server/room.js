import {setTimeout} from "node:timers";
import Game from "./game.js";
import RaPhase from "./phases/cyclic/ra-phase.js";
import SphinxPhase from "./phases/cyclic/sphinx-phase.js";
import MummyPhase from "./phases/cyclic/mummy-phase.js";
import MorningPhase from "./phases/cyclic/morning-phase.js";
import StartingPhase from "./phases/non-cyclic/starting-phase.js";
import WaitingPhase from "./phases/non-cyclic/waiting-phase.js";
import RolePhase from "./phases/non-cyclic/role-phase.js";
import PlayerManager from "./player/player-manager.js";
import RequestSender from "./request-sender.js";
import VotePhase from "./phases/cyclic/vote-phase.js";
import ExecutionPhase from "./phases/cyclic/execution-phase.js";
import {ROLES, STATUS} from "./const.js";
import {capitalizeFirstLetter} from "./utils.js";

const defaultRoles = [ROLES.RA, ROLES.MUMMY, ROLES.SLAVE, ROLES.SPHINX];

export default class Room {
    constructor(io, id, gameEndCallback, roles = [...defaultRoles]) {
        this.io = io;
        this.id = id;
        this.gameEndCallback = gameEndCallback;

        this.requestSender = new RequestSender(io, id);
        this.playerManager = new PlayerManager(this.requestSender);
        this.game = new Game(this.playerManager);

        this.roles = roles;

        this.started = false;

        /** @type {Phase} */
        this.currentPhase = new WaitingPhase();
        this.phaseIndex = -1;
        this.phases = [
            new SphinxPhase(this.requestSender, this.playerManager, this.game),
            new RaPhase(this.requestSender, this.playerManager, this.game),
            new MummyPhase(this.requestSender, this.playerManager),
            new MorningPhase(this.requestSender, this.playerManager, this.game),
            new VotePhase(this.requestSender, this.playerManager),
            new ExecutionPhase(this.requestSender, this.playerManager, this.game),
        ]

        this.timer = null;
        this.gameMaster = null;
    }

    hasPlayer(playerId) {
        return this.playerManager.hasPlayer(playerId);
    }

    getJoinScore() {
        const maxPlayers = this.roles.length;
        const fillRatio = this.playerManager.getPlayerNb() / maxPlayers;
        const capacityWeight = Math.sqrt(maxPlayers);

        return fillRatio * 20 + capacityWeight / 1.85;
    }

    isEmpty() {
        return this.io.sockets.adapter.rooms.get(this.id) === undefined;
    }

    addPlayer(socket, playerName) {
        const player = this.playerManager.createNewPlayer(socket, playerName);

        this.requestSender.send("player-join", player.serialize());
        socket.join(this.id);

        if(this.playerManager.getPlayerNb() === 0) { //First player
            this.gameMaster = player;
        }

        if (this.playerManager.addPlayer(player) === this.roles.length) { //Add player and check if enough player to start game
            this.currentPhase = new StartingPhase();

            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.startGame(), this.currentPhase.duration * 1000);
        }
    }

    canJoin() {
        return this.playerManager.getPlayerNb() < this.roles.length;
    }

    startGame() {
        if (this.playerManager.getPlayerNb() === this.roles.length) {
            this.started = true;
            this.currentPhase = new RolePhase(this.requestSender, this.playerManager, this.roles);
            this.currentPhase.execute();

            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.nextPhase(), this.currentPhase.duration * 1000);
        }
    }

    /**
     * Handles player disconnection
     * If the game hasn't started, the player is removed from the room
     * @param playerId
     */
    disconnectPlayer(playerId) {
        if (this.started) {
            //TODO
        } else {
            const removedPlayer = this.playerManager.removePlayerById(playerId);
            if (this.currentPhase.name === "Starting") {
                this.currentPhase = new WaitingPhase();
                clearTimeout(this.timer);
            }

            this.requestSender.send("player-leave", removedPlayer.serialize());

            if(removedPlayer.color === this.gameMaster.color && this.playerManager.getPlayerNb() > 0) {
                this.updateGameMaster();
            }
        }
    }

    /**
     * Passes the game to its next phase
     * If a phase requirements are not met it is skipped
     */
    nextPhase() {
        clearTimeout(this.timer);
        if(this.game.updateGameStatus(this.playerManager) !== STATUS.STILL_GOING) {
            this.requestSender.endRequest(this.game.status);
            this.gameEndCallback(this.id);
        } else {
            this.playerManager.clearActivePlayers();

            this.phaseIndex++;
            if (this.phaseIndex >= this.phases.length) {
                this.phaseIndex = 0;
            }

            this.currentPhase = this.phases[this.phaseIndex];

            if (this.currentPhase.isValid()) {
                this.currentPhase.execute();
                this.startPhaseTimer(this.currentPhase.duration);
            } else {
                this.nextPhase();
            }
        }
    }

    startPhaseTimer(time) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.nextPhase();
        }, time * 1000);
    }

    /**
     * Executes the action of a player's role
     * @param selectedPlayers players selected by the action
     */
    executeAction(selectedPlayers) {
        this.game.usePower(this.currentPhase.name.toLowerCase(), selectedPlayers);
        this.nextPhase();
    }

    vote(voteData, voterSocket) {
        const unvoted = voteData["unvoted"];
        const voted = voteData["voted"];

        if(unvoted != null) {
            this.game.unvote(unvoted); //remove previous vote
        }
        if(voted != null) {
            this.game.vote(voted);
        }

        const voter = this.playerManager.getPlayerById(voterSocket.id);

        const updateData = {
            voter: voter.serialize(),
            unvoted: unvoted,
            voted: voted
        };

        if(this.currentPhase.name !== capitalizeFirstLetter(ROLES.MUMMY)) { //Village vote, we send the vote to everyone
            this.requestSender.send("vote-update", updateData, this.id, voterSocket);
        } else {
            const otherMummiesId = this.playerManager.activePlayersIds.filter(playerId => playerId !== voterSocket.id);
            otherMummiesId.forEach((playerId) => {
                this.requestSender.send("vote-update", updateData, playerId);
            })
        }
    }

    updateGameMaster() {
        this.gameMaster = this.playerManager.players[0];
        this.requestSender.gameMasterChange(this.gameMaster.color);
    }

    changeRoles(newRoles, playerSocket) {
        const rolePlayerRatio = newRoles.length - this.playerManager.getPlayerNb();

        if(rolePlayerRatio >= 0) {
            this.roles = newRoles;

            if(rolePlayerRatio === 0) { //As much roles as players
                this.currentPhase = new StartingPhase(this.requestSender);
                this.currentPhase.execute();
                clearTimeout(this.timer);
                this.timer = setTimeout(() => this.startGame(), (this.currentPhase.duration+2) * 1000);
            } else { //More roles than players
                if(this.currentPhase.name === "Starting") {
                    this.currentPhase = new WaitingPhase(this.requestSender);
                    this.currentPhase.execute();
                }
            }

            this.requestSender.rolesChange(newRoles, playerSocket);
        }
    }

    serialize() {
        return {
            id: this.id,
            players: this.playerManager.serialize(),
            roles: this.roles,
            phase: this.currentPhase.name,
            gameMaster: this.gameMaster,
        }
    }
}