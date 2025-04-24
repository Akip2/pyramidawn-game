import React from "react";
import IQuestion from "@/data/question/iquestion";

export default abstract class RoleQuestion implements IQuestion {
    roleName: string;
    roleDescription: string;
    imageLink: string;

    protected constructor(roleName: string, roleDescription: string, imageLink: string) {
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.imageLink = imageLink;
    }

    getHTML(): React.JSX.Element {
        return (
            <p>{this.roleName}</p>
            //TODO
        );
    }
}