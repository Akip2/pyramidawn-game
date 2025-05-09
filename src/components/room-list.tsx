import RoomData from "@/data/room-data";
import RoomComponent from "@/components/room-component";
import {useEffect, useState} from "react";
import {socket} from "@/data/socket";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {ArrowLeft, RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function RoomList(props: { quitButtonCallback: () => void }) {
    const [roomsLoaded, setRoomsLoaded] = useState(false);
    const [rooms, setRooms] = useState<RoomData[]>([]);

    useEffect(() => {
        updateRooms();
    }, []);

    function updateRooms() {
        setRoomsLoaded(false);
        setRooms([]);

        socket.emit("get-rooms", (updatedRooms: RoomData[]) => {
            setRooms(updatedRooms);
            setRoomsLoaded(true);
        })
    }

    return (
        <div
            className="flex flex-col -mt-5 gap-5 items-center bg-gray-900/80 border border-yellow-600 p-8 w-2/5 min-w-[500px] shadow-2xl backdrop-blur-sm relative overflow-y-scroll h-2/4 min-h-[300px]">
            <div className="absolute top-4 left-4 flex gap-3">
                <Button
                    onClick={props.quitButtonCallback}
                    className="bg-yellow-600 hover:bg-yellow-500 text-black p-2 rounded-lg shadow-md transition-all"
                    title="Back to Menu"
                >
                    <ArrowLeft className="w-5 h-5"/>
                </Button>
                <Button
                    onClick={updateRooms}
                    className="bg-yellow-600 hover:bg-yellow-500 text-black p-2 rounded-lg shadow-md transition-all"
                    title="Refresh Rooms"
                >
                    <RefreshCw className="w-5 h-5"/>
                </Button>
            </div>

            <h2 className="text-2xl font-bold text-yellow-300 mb-2">Available Rooms</h2>

            {roomsLoaded ? (
                rooms.length > 0 ? (
                    rooms.map((room: RoomData, idx) => (
                        <RoomComponent room={room} key={idx}/>
                    ))
                ) : (
                    <p className="text-lg text-yellow-100 italic opacity-70">
                        No rooms currently available...
                    </p>
                )
            ) : (
                <LoadingSpinner/>
            )}
        </div>
    );
}