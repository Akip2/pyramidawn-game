import React from "react";
import IQuestion from "@/data/question/iquestion";
import {RoleEnum} from "@/enums/role.enum";
import {capitalizeFirstLetter, isRoleMummy} from "@/lib/utils";
import Image from "next/image";
import {RoleObjectiveEnum} from "@/enums/role-objective.enum";
import {roleDescriptions} from "@/data/role-descriptions";
import {getRoleImageLink} from "@/data/question/role/role-factory";

const textColors = {
    good: "text-blue-400",
    evil: "text-red-400",
}

export default class RoleQuestion implements IQuestion {
    name: RoleEnum;
    objective: RoleObjectiveEnum;
    ability: string;
    imageLink: string;
    statusColor: string;

    constructor(roleName: RoleEnum) {
        this.name = roleName;
        const description = roleDescriptions[this.name];

        this.objective = description.objective;
        this.ability = description.ability;
        this.imageLink = getRoleImageLink(this.name);
        this.statusColor = isRoleMummy(roleName) ? textColors.evil : textColors.good;
    }

    getHTML(): React.JSX.Element {
        return (
            <div className="flex flex-col items-center gap-5 justify-between">
                <p className={`w-fit text-4xl font-bold text-center ${this.statusColor}`}>{capitalizeFirstLetter(this.name as string)}</p>
                <Image src={this.imageLink} alt={`${this.name} icon`} width={225} height={225}/>
                <div className="flex flex-col items-start gap-4 mb-5">
                    <p><b className="font-bold text-xl">Objective:</b> {this.objective as string}</p>
                    <p><b className="font-bold text-xl">Ability:</b> {this.ability}</p>
                </div>
            </div>
        );
    }
}