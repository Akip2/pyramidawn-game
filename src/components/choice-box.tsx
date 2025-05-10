import {useChoice} from "@/context/choice-provider";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {JSX, useCallback} from "react";
import {useAction} from "@/context/action-provider";
import {socket} from "@/data/socket";
import {ChoiceType} from "@/enums/choice-type.enum";
import {useGame} from "@/context/game-provider";

export default function ChoiceBox() {
    const {id} = useGame();
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
        socket.emit("role-action", id, selectedPlayers);
        setSelectedPlayers([]);
    }, [setAction, setVisibility, id, selectedPlayers, setSelectedPlayers]);

    const activateHandler = useCallback(() => {
        setAction(true);
        setVisibility(false);
    }, [setVisibility, setAction]);

    const passHandler = useCallback(() => {
        setVisibility(false);
        socket.emit("pass", id);
    }, [id, setVisibility]);

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

        case ChoiceType.END:
            options =(
                <>
                    <Button size="lg">PLAY AGAIN</Button>
                    <Button size="lg">MAIN MENU</Button>
                </>
            )
            break;

        default:
            options = (<Button size="lg">Placeholder</Button>)
    }

    return (
        <motion.div
            className="flex flex-col gap-2 text-center p-4 rounded-2xl min-h-[200px] min-w-[300px] w-1/4 max-w-[500px]  font-semibold bg-gray-800 shadow-[0_0_20px_rgba(31,41,55,1)] self-center z-10 text-xl justify-around"
            initial={{y: "-100vh"}}
            animate={visible ? {y: 0} : {y: "-100vh"}}
            transition={{duration: 0.8, ease: "easeInOut"}}
        >
            {question.getHTML()}
            {options}
        </motion.div>
    );
}