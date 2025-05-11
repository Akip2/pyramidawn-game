import {RoleEnum} from "@/enums/role.enum";
import {capitalizeFirstLetter} from "@/lib/utils";
import Image from "next/image";
import React, {JSX, useState} from "react";
import {getRoleImageLink} from "@/data/question/role/role-factory";
import {useGame} from "@/context/game-provider";
import PlusButton from "@/components/plus-button";
import MinusButton from "@/components/minus-button";
import {roleDescriptions} from "@/data/role-descriptions";

export default function Role(props: { editable: boolean, roleName: RoleEnum, unique: boolean }) {
    const {editable, roleName, unique} = props;
    const description = roleDescriptions[roleName];
    const objective = description.objective;
    const ability = description.ability;
    const imageLink = getRoleImageLink(roleName);

    const {getRoleCount, addRole, removeRole, getPlayersNb, getRolesNb, started} = useGame();
    const roleNb = getRoleCount(roleName);
    const exists = roleNb > 0;

    const [showRoleDescription, setShowRoleDescription] = useState(false);

    let editionButtons:JSX.Element | null = null;
    if (editable) {
        const addRoleEvent = () => {
            addRole(roleName);
        }

        const removeRoleEvent = () => {
            if(getPlayersNb() < getRolesNb()) {
                removeRole(roleName);
            }
        }
        
        if(unique) {
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
                    <Image src={imageLink} alt={`${roleName} icon`} width={120} height={120}
                           className={exists ? "" : "grayscale"}/>
                    <div className="role-indicator top-0.5 right-0.5 cursor-pointer"
                         onMouseEnter={() => setShowRoleDescription(true)}
                         onMouseLeave={() => setShowRoleDescription(false)}
                    >
                        ?
                    </div>

                    {showRoleDescription && (
                        <div className="absolute z-50 -top-10 left-32 w-64 bg-gray-900 text-white text-sm rounded-lg shadow-lg p-3 pointer-events-none">
                            <p><mark className="font-bold bg-transparent text-white">Objective:</mark> {objective}</p>
                            <p className="mt-2"><mark className="font-bold bg-transparent text-white">Ability:</mark> {ability}</p>
                        </div>
                    )}

                    {!unique &&
                        (
                            <div className="role-indicator -bottom-2">
                                {roleNb}
                            </div>
                        )
                    }

                    {editionButtons}
                </div>
                <p className="text-lg font-semibold text-yellow-300 text-center">
                    {capitalizeFirstLetter(roleName as string)}
                </p>
            </div>
        )
    } else {
        return null;
    }
}