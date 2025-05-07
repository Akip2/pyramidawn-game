import RoomData from "@/data/room-data";
import RoomComponent from "@/components/room-component";

export default function RoomList(props: { rooms: RoomData[] }) {
    const {rooms} = props;
    return (
        <div className="w-full h-full flex flex-col gap-5">
            {rooms.map((room: RoomData, idx) => (
                <RoomComponent room={room} key={idx}/>
            ))}
        </div>
    )
}