import {STATUS} from "./const.js";

export default class Game {
    constructor(playerManager) {
        this.votes = new Map();

        this.powerAvailable = new Map();
        this.powerAvailable.set("priest", true);
        this.powerAvailable.set("judge", true);

        this.dayCount = 0;
        this.status = STATUS.STILL_GOING;

        this.protectedPlayer = null;
        this.chosenAvatar = null;
        this.playerManager = playerManager;
    }

    vote(player) {
        if (this.votes.has(player.color)) {
            this.votes.set(player.color, this.votes.get(player.color) + 1); //increase vote count on player
        } else {
            this.votes.set(player.color, 1);
        }
        console.log(this.votes);
    }

    unvote(player) {
        this.votes.set(player.color, this.votes.get(player.color) - 1); //decrease vote count on player
        console.log(this.votes);
    }

    newDay() {
        this.dayCount++;

        this.clearVotes();
        this.protectedPlayer = null;
        this.chosenAvatar = null;
    }

    clearVotes() {
        this.votes.clear();
    }

     /**
      * Calculates the player(s) with the most votes
      * @returns {*[]} an array containing the color(s) of the player(s) with the most votes, in the cas of an equality the array contains multiple players
      */
    getVoteResult() {
        let result = [];
        let maxVote = 1;

        this.votes.forEach((val, key) => {
            if (val > maxVote) {
                maxVote = val;
                result = [key];
            } else if (val === maxVote) {
                result.push(key);
            }
        })

        return result;
    }

    isPowerAvailable(role) {
        return this.powerAvailable.get(role);
    }

    updateGameStatus(playerManager) {
        const aliveNb = playerManager.getLivingPlayers().length;

        if(aliveNb > 0) {
            const aliveWraithsNb = playerManager.getWraiths().length;

            if (aliveNb === aliveWraithsNb) {
                this.status = STATUS.WRAITHS_WIN;
            } else if (aliveWraithsNb === 0) {
                this.status = STATUS.VILLAGE_WIN;
            } else {
                this.status = STATUS.STILL_GOING;
            }
        } else {
            this.status = STATUS.EQUALITY; //Everyone is dead
        }

        return this.status;
    }

    usePower(power, selectedPlayers) {
        if(power === "golem") {
            this.protectedPlayer = selectedPlayers[0];
        } else if (power === "anubis") {
            this.playerManager.kill(selectedPlayers[0].color, "killed by Anubis");
        } else if(power === "ra") {
            this.playerManager.revealPlayer(selectedPlayers[0].color);
        }
        else if(power === "priest" || power === "judge") {
            if (power === "priest") {
                this.chosenAvatar = selectedPlayers[0];
            } else {
                //TODO
            }
            this.powerAvailable.set(power, false);
        }
    }
 }