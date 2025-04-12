import {useChoice} from "@/context/choice-provider";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {ChoiceType} from "@/context/choice-provider";
import {JSX, useCallback} from "react";
import {useAction} from "@/context/action-provider";
import {socket} from "@/data/socket";

export default function ChoiceBox() {
    const {visible, question, choiceType, setVisibility} = useChoice();
    const {setAction, setSelectedPlayers, selectedPlayers} = useAction();

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
        setVisibility(false)
        socket.emit("role-action", selectedPlayers);
        setSelectedPlayers([]);
    }, [setVisibility, setAction, setSelectedPlayers, selectedPlayers]);

    const activateHandler = useCallback(() => {
        setAction(true);
        setVisibility(false);
    }, [setVisibility, setAction]);

    const passHandler = useCallback(() => {
        setVisibility(false);
        socket.emit("pass");
    }, [setVisibility]);

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

        case ChoiceType.ACTIVATE_POWER:
            options = (
                <>
                    <Button size="lg" onClick={activateHandler}>YES</Button>
                    <Button size="lg" onClick={passHandler}>NO</Button>
                </>
            )
            break;

        default:
            options = (<Button size="lg">Placeholder</Button>)
    }

    return (
        <motion.div
            className="flex flex-col text-center p-4 rounded-2xl min-h-[200px] min-w-[300px] w-1/4 max-w-[480px] bg-gray-800 shadow-[0_0_20px_rgba(31,41,55,1)] self-center z-10 text-xl justify-around"
            initial={{y: "-100vh"}}
            animate={visible ? {y: 0} : {y: "-100vh"}}
            transition={{duration: 0.8, ease: "easeInOut"}}
        >
            <p>{question}</p>
            {options}
        </motion.div>
    );
}