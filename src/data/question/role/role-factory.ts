import RoleQuestion from "@/data/question/role/role-question";
import {roleDescriptions} from "@/data/role-descriptions";
import {RoleEnum} from "@/enums/role.enum";

export function createRoleQuestion(role:RoleEnum) {
    const description = roleDescriptions[role];
    const imageLink = getRoleImageLink(role);
    return new RoleQuestion(role, description, imageLink);
}

export function getRoleImageLink(role:RoleEnum) {
    return `/role_icons/${role}.png`;
}