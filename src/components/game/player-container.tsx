import {useGame} from "@/context/game-provider";
import PlayerAvatar from "@/components/player-avatar";
import PhaseDisplayer from "@/components/game/phase-displayer";
import ChoiceBox from "@/components/game/choice-box";

export default function PlayerContainer() {
    const {players} = useGame();

    return (
        <div
            className="flex flex-col w-full h-full relative items-center justify-center"
            style={{
                backgroundImage: `url('/background.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center top"
            }}
        >
            <PhaseDisplayer/>
            <ChoiceBox/>
            <div className="flex row justify-around items-end w-full h-1/2 min-h-[340px] absolute bottom-0 mb-[5vh]">
                {players.map((player, index) => (
                    <PlayerAvatar key={index} player={player}/>
                ))}
            </div>
        </div>
    );
}