import SphinxQuestion from "@/data/question/role/sphinx-question";
import RoleQuestion from "@/data/question/role/role-question";
import {ROLES} from "../../../../server/const";

export default function createRoleQuestion(role:string) {
    let question:RoleQuestion;

    switch (role) {
        //TODO
        case ROLES.SPHINX:
            question = new SphinxQuestion();
            break;
        default:
            question = new SphinxQuestion();
    }

    return question;
}