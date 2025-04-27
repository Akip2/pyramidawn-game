import React from "react";
import IQuestion from "@/data/question/iquestion";
import {RoleEnum} from "@/enums/role.enum";
import {capitalizeFirstLetter, isRoleMummy} from "@/lib/utils";
import Image from "next/image";

const textColors = {
    good: "text-blue-400",
    evil: "text-red-400",
}

export default class RoleQuestion implements IQuestion {
    roleName: RoleEnum;
    roleDescription: string;
    imageLink: string;
    statusColor: string;

    constructor(roleName: RoleEnum, roleDescription: string, imageLink: string) {
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.imageLink = imageLink;
        this.statusColor = isRoleMummy(roleName) ? textColors.evil : textColors.good;
    }

    getHTML(): React.JSX.Element {
        return (
            <div className="flex flex-col items-center gap-5 justify-between">
                <p className={`w-fit text-4xl text-center font-bold ${this.statusColor}`}>{capitalizeFirstLetter(this.roleName as string)}</p>
                <Image src={this.imageLink} alt={`${this.roleName} icon`} width={225} height={225}/>
                <p className="mb-5">{this.roleDescription}</p>
            </div>
        );
    }
}