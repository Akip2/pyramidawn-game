import styles from "../styles.module.css";
import {useGame} from "@/app/context/GameProvider";
import PlayerAvatar from "@/components/player-avatar";

export default function PlayerContainer() {
    const {players} = useGame();

    return (
        <div className={styles.background}>
            <div className="flex row justify-around items-center w-full h-1/6 absolute bottom-0">
                {players.map((player, index) => (
                    <PlayerAvatar key={index} name={player.name} color={player.color}/>
                ))}
            </div>
        </div>
    );
}