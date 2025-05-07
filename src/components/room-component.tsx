import RoomData from "@/data/room-data";

export default function RoomComponent(props: {room: RoomData}) {
    const { room } = props;
    return (
        <div>
            <p>{room.id}</p>
        </div>
    )
}