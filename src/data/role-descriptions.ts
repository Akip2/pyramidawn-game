import {RoleEnum} from "@/enums/role.enum";
import {RoleObjectiveEnum} from "@/enums/role-objective.enum";

export const roleDescriptions: Record<RoleEnum, { objective: RoleObjectiveEnum, ability: string }> = {
    [RoleEnum.NONE]: {objective: RoleObjectiveEnum.NONE, ability: ""},

    [RoleEnum.SPHINX]: {objective: RoleObjectiveEnum.GOOD, ability: "Protects a player each night"},
    [RoleEnum.MUMMY]: {objective: RoleObjectiveEnum.EVIL, ability: "Murders a player each night"},
    [RoleEnum.RA]: {objective: RoleObjectiveEnum.GOOD, ability: "Reveals the role of a player each night"},
    [RoleEnum.SLAVE]: {objective: RoleObjectiveEnum.GOOD, ability: "None"}
};