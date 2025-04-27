import RoleQuestion from "@/data/question/role/role-question";
import {ROLES} from "../../../../server/const";

export default class SphinxQuestion extends RoleQuestion{
    constructor() {
        super(
            ROLES.SPHINX,
            "Each night, you can choose one player to protect. If they are attacked, they will survive.",
            ""
        );
    }
}