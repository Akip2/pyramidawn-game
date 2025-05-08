import RoomData from "@/data/room-data";
import {Card, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {getRoleImageLink} from "@/data/question/role/role-factory";
import {Button} from "@/components/ui/button";

export default function RoomComponent({ room }: { room: RoomData }) {
    return (
        <Card className="w-full bg-gray-800 border-yellow-600 text-white shadow-md hover:shadow-yellow-500/30 transition-shadow duration-200 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col justify-center w-1/3">
                    <CardTitle className="text-yellow-300 text-md truncate">{`${room.gameMaster.name}'s game`}</CardTitle>
                    <p className="text-sm text-yellow-100 opacity-80">
                        {room.players.length}/{room.roles.length} players
                    </p>
                </div>

                <div className="flex gap-2 w-1/3 overflow-hidden">
                    {room.roles.slice(0, 4).map((role, index) => (
                        <Image
                            key={index}
                            src={getRoleImageLink(role)}
                            alt={`Role ${index + 1}`}
                            width={32}
                            height={32}
                        />
                    ))}
                </div>

                <div className="w-1/3 flex justify-end">
                    <Button className="bg-yellow-600 hover:bg-yellow-500 text-black text-sm px-4 py-1 h-auto">
                        Join
                    </Button>
                </div>
            </div>
        </Card>
    );
}