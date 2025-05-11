import RoleQuestion from "@/data/question/role/role-question";
import {RoleEnum} from "@/enums/role.enum";

export function createRoleQuestion(role:RoleEnum) {
    return new RoleQuestion(role);
}

export function getRoleImageLink(role:RoleEnum) {
    return `/role_icons/${role}.png`;
}