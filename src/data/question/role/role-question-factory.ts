import RoleQuestion from "@/data/question/role/role-question";
import {roleDescriptions} from "@/data/role-descriptions";
import {RoleEnum} from "@/enums/role.enum";

export default function createRoleQuestion(role:RoleEnum) {
    const description = roleDescriptions[role];
    const imageLink = `/role_icons/${role}.png`;
    return new RoleQuestion(role, description, imageLink);
}