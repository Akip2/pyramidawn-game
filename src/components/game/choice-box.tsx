import {useChoice} from "@/context/choice-provider";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {ChoiceType} from "@/context/choice-provider";
import {JSX, useCallback} from "react";
import {useAction} from "@/context/action-provider";
import {socket} from "@/data/socket";

export default function ChoiceBox() {
    const {visible, question, choiceType, setVisibility} = useChoice();
    const {setAction, setSelectedPlayers} = useAction();

    const okHandler = useCallback(() => {
        setAction(true);
        setVisibility(false);
    }, [setVisibility, setAction]);

    const cancelHandler = useCallback(() => {
        setAction(true);
        setVisibility(false);
        setSelectedPlayers([]);
    }, [setVisibility, setAction, setSelectedPlayers]);

    const validateHandler = useCallback(() => {
        setAction(false);
        setVisibility(false);
        setSelectedPlayers([]);
    }, [setVisibility, setAction, setSelectedPlayers]);

    let options: JSX.Element;
    switch (choiceType) {
        case ChoiceType.OK:
            options = (
                <Button size="lg" onClick={okHandler}>OK</Button>
            );
            break;

        case ChoiceType.VALIDATE_CHOICE:
            options = (
                <>
                    <Button size="lg" onClick={validateHandler}>YES</Button>
                    <Button size="lg" onClick={cancelHandler}>NO</Button>
                </>
            )
            break;

        default:
            options = (<Button size="lg">Placeholder</Button>)
    }

    return (
        <motion.div
            className="flex flex-col text-center p-4 rounded-2xl  h-1/4 max-w-[400px] bg-gray-800 self-center z-10 text-2xl justify-around"
            initial={{y: "-100vh"}}
            animate={visible ? {y: 0} : {y: "-100vh"}}
            transition={{duration: 0.8, ease: "easeInOut"}}
        >
            <p>{question}</p>
            {options}
        </motion.div>
    );
}