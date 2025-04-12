'use client'

import PlayerData from "@/data/player-data";
import {motion} from "framer-motion";

export default function VoteContainer(props: { voters: PlayerData[] }) {
    const voters = props.voters;
    return (
        <motion.div
            className="flex flex-row items-center justify-around w-full h-8"
            animate={{ y: [0, -5, 0] }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
            }}
        >
            {voters.map((voter, index) => (
                <div key={index} className="rounded-2xl w-8 h-full mr-1 ml-1 border-white border-4"
                     style={{backgroundColor: voter.color}}>
                </div>
            ))}
        </motion.div>
    )
}