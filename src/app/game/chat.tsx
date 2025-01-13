export default function Chat(){
    return (
        <div className="flex flex-col min-w-[200px] w-1/4 h-full">
            <div className="w-full h-[95vh] bg-gray-900 border-solid"></div>

            <div className="w-full h-[5vh] bg-gray-700 border-solid px-2">
                <input className="w-full h-full bg-inherit outline-none" type="text" placeholder="Message chat"></input>
            </div>
        </div>
    );
}