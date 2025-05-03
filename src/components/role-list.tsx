import {usePlayer} from "@/context/player-provider";
import {useGame} from "@/context/game-provider";
import Role from "@/components/role";
import {RoleEnum} from "@/enums/role.enum";

export default function RoleList() {
    const {color} = usePlayer();
    const {gameMaster, started} = useGame();

    const editable = color === gameMaster && !started;
    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-5 px-2 py-4">
                <Role editable={editable} roleName={RoleEnum.SLAVE} unique={false}/>
                <Role editable={editable} roleName={RoleEnum.MUMMY} unique={false}/>
                <Role editable={editable} roleName={RoleEnum.PRIEST} unique={true}/>
                <Role editable={editable} roleName={RoleEnum.SPHINX} unique={true}/>
            </div>
        </div>
    )
}