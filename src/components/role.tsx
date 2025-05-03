import {RoleEnum} from "@/enums/role.enum";
import {capitalizeFirstLetter} from "@/lib/utils";
import Image from "next/image";
import React, {JSX} from "react";
import {getRoleImageLink} from "@/data/question/role/role-factory";
import {useGame} from "@/context/game-provider";
import {Button} from "@/components/ui/button";

export default function Role(props: { editable: boolean, roleName: RoleEnum, unique: boolean }) {
    const {getRoleCount} = useGame();
    const imageLink = getRoleImageLink(props.roleName);
    const roleNb = getRoleCount(props.roleName);

    let editionButtons:JSX.Element | null = null;
    if (props.editable) {
        if(props.unique) {

        } else {
            editionButtons = (
                <div>
                    <Button className="role-button bottom-1 right-0.5">
                        +
                    </Button>

                    <Button className="role-button bottom-1 left-0.5">
                        -
                    </Button>
                </div>
            )
        }
    }

    return (
        <div className="flex flex-col items-center gap-1.5 bg-gray-800 rounded-lg p-2">
            <div className="relative rounded-full flex items-center justify-center">
                <Image src={imageLink} alt={`${props.roleName} icon`} width={120} height={120}/>
                <div className="role-indicator top-0.5 right-0.5 cursor-pointer">
                    ?
                </div>

                {props.editable && !props.unique
                    ? (
                        <div className="role-indicator -bottom-1.5">
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
}