export default class Game {
    constructor() {
        this.votes = new Map();

        this.powerAvailable = new Map();
        this.powerAvailable.set("priest", true);
        this.powerAvailable.set("judge", true);
    }

    vote(player) {
        if (this.votes.has(player.color)) {
            this.votes.set(player.color, this.votes.get(player.color) + 1); //increase vote count on player
        } else {
            this.votes.set(player.color, 1);
        }
    }

    unvote(player) {
        this.votes.set(player.color, this.votes.get(player.color) - 1); //decrease vote count on player
    }

     /**
      * Calculates the player(s) with the most votes
      * @returns {*[]} an array containing the player with the most votes, in the cas of an equality the array contains multiple players
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

    usePower(power, selectedPlayers) {
        if(power === "golem") {
            this.protectedPlayer = selectedPlayers[0];
        } else if(power === "priest" || power === "judge") {
            if (power === "priest") {
                this.chosenAvatar = selectedPlayers[0];
            } else {
                //TODO
            }
            this.powerAvailable.set(power, false);
        }
    }
 }