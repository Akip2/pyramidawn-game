import {setTimeout} from "node:timers";
import Game from "./game.js";
import PriestPhase from "./phases/cyclic/priest-phase.js";
import GolemPhase from "./phases/cyclic/golem-phase.js";
import WraithPhase from "./phases/cyclic/wraith-phase.js";
import MorningPhase from "./phases/cyclic/morning-phase.js";
import StartingPhase from "./phases/non-cyclic/starting-phase.js";
import WaitingPhase from "./phases/non-cyclic/waiting-phase.js";
import RolePhase from "./phases/non-cyclic/role-phase.js";
import PlayerManager from "./player-manager.js";
import RequestSender from "./request-sender.js";

//const possibleColors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white"];
const defaultRoles = ["priest", "wraith", "wraith", "golem", "slave"];
//const phases = ["Golem", "Priest", "Temple", "Wraith", "Morning", "Vote", "Judge"]

export default class Room {
    constructor(io, id, roles = [...defaultRoles]) {
        this.io = io;
        this.id = id;

        this.requestSender = new RequestSender(io, id);

        this.game = new Game();

        this.roles = roles;
        //this.players = [];
        this.playerManager = new PlayerManager();
        //this.remainingColors = [...possibleColors];

        //this.activePlayersIds = []; //Array containing the id(s) of player(s) doing an action during this phase

        this.started = false;

        /** @type {Phase} */
        this.currentPhase = new WaitingPhase();
        this.phaseIndex = -1;
        this.phases = [
            new GolemPhase(this.requestSender, this.playerManager),
            new PriestPhase(this, this.playerManager, this.game),
            new WraithPhase(this, this.playerManager),
            new MorningPhase(this.requestSender, this.game, this.playerManager)
        ]

        this.timer = null;
    }

    isFree() {
        return (!this.started && this.getNbPlayers() < this.roles.length);
    }

    hasPlayer(playerId) {
        return this.playerManager.hasPlayer(playerId);
    }

    getNbPlayers() {
        let socketRoom = this.io.sockets.adapter.rooms.get(this.id);
        return socketRoom ? socketRoom.size : 0;
    }

    isEmpty() {
        return this.io.sockets.adapter.rooms.get(this.id) === undefined;
    }

    /*
    getFreeColor() {
        const randomIndex = Math.floor(Math.random() * this.remainingColors.length);
        return this.remainingColors.splice(randomIndex, 1)[0];
    }
     */

    addPlayer(socket, playerName) {
        const player = this.playerManager.createNewPlayer(socket, playerName);

        this.requestSender.send("player-join", player.serialize());
        //this.io.to(this.id).emit("player-join", player.serialize());
        socket.join(this.id);

        if (this.playerManager.addPlayer(player) === this.roles.length) { //Add player and check if enough player to start game
            this.currentPhase = new StartingPhase();

            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.startGame(), this.currentPhase.duration * 1000);
        }
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

        } else {
            const removedPlayer = this.playerManager.removePlayerById(playerId);
            if (this.currentPhase.name === "Starting") {
                this.currentPhase = new WaitingPhase();
                clearTimeout(this.timer);
            }

            this.requestSender.send("player-leave", removedPlayer.serialize());
            //this.io.to(this.id).emit("player-leave", removedPlayer.serialize());
        }
    }

    /**
     * Passes the game to its next phase
     * If a phase requirements are not met it is skipped
     */
    nextPhase() {
        clearTimeout(this.timer);

        this.playerManager.stopActions(this);

        this.phaseIndex++;
        if (this.phaseIndex >= this.phases.length) {
            this.phaseIndex = 0;
        }

        this.currentPhase = this.phases[this.phaseIndex];

        if(this.currentPhase.isValid()) {
            this.currentPhase.execute();
            this.startPhaseTimer(this.currentPhase.duration);
        }
    }

    startPhaseTimer(time) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.nextPhase(), time * 1000);
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

        if(this.currentPhase.name !== "Wraith") { //Village vote, we send the vote to everyone
            this.requestSender.send("vote-update", updateData, this.id, voterSocket);
        } else {
            const otherWraithsIds = this.playerManager.activePlayersIds.filter(playerId => playerId !== voterSocket.id);
            otherWraithsIds.forEach((playerId) => {
                this.requestSender.send("vote-update", updateData, playerId);
            })
        }
    }

    serialize() {
        return {
            players: this.playerManager.serialize(),
            roles: this.roles,
            phase: this.currentPhase.name
        }
    }
}