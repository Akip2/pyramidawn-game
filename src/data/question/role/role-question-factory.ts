import GolemQuestion from "@/data/question/role/golem-question";
import RoleQuestion from "@/data/question/role/role-question";

export default function createRoleQuestion(role:string) {
    let question:RoleQuestion;

    switch (role) {
        //TODO
        case "golem":
            question = new GolemQuestion();
            break;
        default:
            question = new GolemQuestion();
    }

    return question;
}