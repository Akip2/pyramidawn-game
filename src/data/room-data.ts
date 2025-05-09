import {RoleEnum} from "@/enums/role.enum";
import PlayerData from "@/data/player-data";

export default class RoomData {
    id: number;
    gameMaster: PlayerData;
    players: PlayerData[];
    roles: RoleEnum[];
    phase: string;

    constructor(id: number, gameMaster: PlayerData, players: PlayerData[], roles: RoleEnum[], phase: string) {
        this.id = id;
        this.gameMaster = gameMaster;
        this.players = players;
        this.roles = roles;
        this.phase = phase;
    }
}