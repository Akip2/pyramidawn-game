import { useState } from "react";
import { socket } from "@/socket";

socket.on("chat-message", function(data){
    console.log(data);
});

export default function Chat(){
    const [inputValue, setInputValue] = useState('');

    const sendMessage = (event: any) => {
        if (event.key === 'Enter') {
            let trimedValue = inputValue.trim();
            if(trimedValue.length > 0){
                socket.emit("send-message", trimedValue);
            }
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col min-w-[200px] w-1/4 h-full">
            <div className="w-full h-[95vh] bg-gray-900 border-solid"></div>

            <div className="w-full h-[5vh] bg-gray-700 border-solid px-2">
                <input 
                    type="text" 
                    className="w-full h-full bg-inherit outline-none" 
                    placeholder="Message chat"
                    value={inputValue}
                    onKeyDown={sendMessage}
                    onChange={(event) => setInputValue(event.target.value)}
                />
            </div>
        </div>
    );
}