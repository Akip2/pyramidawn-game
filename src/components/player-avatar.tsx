'use client'

export default function PlayerAvatar({name, color} : any) {
    return (
        <div className="w-[5vmin] h-[18vmin] flex flex-col items-center">
            <p className="mb-1">{name}</p>

            <div className="w-full h-full" style={{ backgroundColor: color }}></div>
        </div>
    )
}