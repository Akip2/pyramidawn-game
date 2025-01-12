export default function Chat(){
    return (
        <div className="flex flex-col justify-between py-[3vh] pl-[1vw] min-w-[200px] w-1/5 h-full self-center">
            <div className="w-full h-[92%] bg-gray-900 border-solid rounded-lg"></div>

            <div className="w-full h-[6%] p-2 bg-gray-700 border-solid rounded-lg">
                <input className="w-full h-full bg-inherit outline-none" type="text"></input>
            </div>
        </div>
    );
}