'use client'

export default function PlayerAvatar({name, color}: any) {
    return (
        <div className="w-[5vw] h-[15vw] flex flex-col items-center -translate-y-1/2">
            <p className="mb-1">{name}</p>

            <div className="w-full h-full border-black border" style={{backgroundColor: color}}></div>
        </div>
    )
}