import {Button} from "@/components/ui/button";
import React from "react";

export default function PlusButton(props: { className?: string, onClick?: () => void }) {
    return (
        <Button className={"role-button "+props.className} onClick={props.onClick}>
            +
        </Button>
    );
}