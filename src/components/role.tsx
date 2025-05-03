import {RoleEnum} from "@/enums/role.enum";
import {capitalizeFirstLetter} from "@/lib/utils";
import Image from "next/image";
import React, {JSX} from "react";
import {getRoleImageLink} from "@/data/question/role/role-factory";
import {useGame} from "@/context/game-provider";
import PlusButton from "@/components/plus-button";
import MinusButton from "@/components/minus-button";

export default function Role(props: { editable: boolean, roleName: RoleEnum, unique: boolean }) {
    const {getRoleCount, addRole, removeRole, getPlayersNb, getRolesNb, started} = useGame();
    const imageLink = getRoleImageLink(props.roleName);
    const roleNb = getRoleCount(props.roleName);
    const exists = roleNb > 0;

    let editionButtons:JSX.Element | null = null;
    if (props.editable) {
        const addRoleEvent = () => {
            addRole(props.roleName);
        }

        const removeRoleEvent = () => {
            if(getPlayersNb() < getRolesNb()) {
                removeRole(props.roleName);
            }
        }
        
        if(props.unique) {
            if(exists) {
                editionButtons = (
                    <MinusButton className="-bottom-2" onClick={removeRoleEvent}/>
                )
            } else {
                editionButtons = (
                    <PlusButton className="-bottom-2" onClick={addRoleEvent}/>
                )
            }
        } else {
            editionButtons = (
                <div>
                    <PlusButton className="bottom-1 right-0.5" onClick={addRoleEvent}/>
                    <MinusButton className="bottom-1 left-0.5" onClick={removeRoleEvent}/>
                </div>
            )
        }
    }

    if(exists || !started()) {
        return (
            <div className="flex flex-col items-center gap-2 bg-gray-800 rounded-lg p-2">
                <div className="relative rounded-full flex items-center justify-center">
                    <Image src={imageLink} alt={`${props.roleName} icon`} width={120} height={120}
                           className={exists ? "" : "grayscale"}/>
                    <div className="role-indicator top-0.5 right-0.5 cursor-pointer">
                        ?
                    </div>

                    {!props.unique
                        ? (
                            <div className="role-indicator -bottom-2">
                                {roleNb}
                            </div>
                        )
                        : null
                    }

                    {editionButtons}
                </div>
                <p className="text-lg font-semibold text-yellow-300 text-center">
                    {capitalizeFirstLetter(props.roleName as string)}
                </p>
            </div>
        )
    } else {
        return null;
    }
}