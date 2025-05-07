import {RoleEnum} from "@/enums/role.enum";
import PlayerData from "@/data/player-data";

export default class RoomData {
    id: number;
    gameMaster: PlayerData;
    players: PlayerData[];
    roles: RoleEnum[];

    constructor(id: number, gameMaster: PlayerData, players: PlayerData[], roles: RoleEnum[]) {
        this.id = id;
        this.gameMaster = gameMaster;
        this.players = players;
        this.roles = roles;
    }
}