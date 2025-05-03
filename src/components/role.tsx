import {RoleEnum} from "@/enums/role.enum";
import {capitalizeFirstLetter} from "@/lib/utils";
import Image from "next/image";
import React from "react";
import {getRoleImageLink} from "@/data/question/role/role-factory";

export default function Role(props: { editable: boolean, roleName: RoleEnum, unique: boolean }) {
    const imageLink = getRoleImageLink(props.roleName);

    return (
        <div className="flex flex-col items-center gap-1 bg-gray-800 rounded-lg p-2">
            <div className="relative rounded-full flex items-center justify-center">
                <Image src={imageLink} alt={`${props.roleName} icon`} width={120} height={120}/>
                <div className="absolute top-0.5 right-0.5 w-6 h-6 bg-white text-black text-md rounded-full flex items-center justify-center">
                    ?
                </div>
            </div>
            <p className="text-lg font-semibold text-yellow-300 text-center">
                {capitalizeFirstLetter(props.roleName as string)}
            </p>
        </div>
    )
}