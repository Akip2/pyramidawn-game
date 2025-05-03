import {usePlayer} from "@/context/player-provider";
import {useGame} from "@/context/game-provider";
import Role from "@/components/role";
import {RoleEnum} from "@/enums/role.enum";

export default function RoleList() {
    const {color} = usePlayer();
    const {gameMaster} = useGame();

    const isGameMaster = color === gameMaster;

    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-5 px-2 py-4">
                <Role editable={isGameMaster} roleName={RoleEnum.SLAVE} unique={false}/>
                <Role editable={isGameMaster} roleName={RoleEnum.MUMMY} unique={false}/>
                <Role editable={isGameMaster} roleName={RoleEnum.PRIEST} unique={true}/>
                <Role editable={isGameMaster} roleName={RoleEnum.SPHINX} unique={true}/>
            </div>
        </div>
    )
}