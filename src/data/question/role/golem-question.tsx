import RoleQuestion from "@/data/question/role/role-question";

export default class GolemQuestion extends RoleQuestion{
    constructor() {
        super(
            "Golem",
            "Each night, you can choose one player to protect. If they are attacked, they will survive.",
            ""
        );
    }
}