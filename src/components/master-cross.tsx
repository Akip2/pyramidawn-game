'use client'

import {motion} from "framer-motion";
import Cross from "../../public/cross.svg";

export default function MasterCross() {
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
            <Cross className="w-8 sm:w-12 md:w-16 mb-6 sm:mb-10 md:mb-14 h-auto"/>
        </motion.div>
    )
}