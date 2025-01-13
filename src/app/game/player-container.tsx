import styles from "../styles.module.css";

export default function PlayerContainer(){
    return (
        <div className="bg-gray-800 w-3/4 h-full grid grid-cols-2 border border-black border-l-4 border-t-4 border-r-0 border-b-0">
            <div className={styles["player-box"]}><p>A</p></div>
            <div className={styles["player-box"]}><p>b</p></div>
            <div className={styles["player-box"]}><p>c</p></div>
            <div className={styles["player-box"]}><p>d</p></div>
            <div className={styles["player-box"]}><p>e</p></div>
            <div className={styles["player-box"]}><p>f</p></div>
            <div className={styles["player-box"]}><p>g</p></div>
            <div className={styles["player-box"]}><p>h</p></div>
        </div>
    );
}