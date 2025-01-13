import { useState } from "react";

export default function Chat(){
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
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
                    onKeyDown={handleKeyDown}
                    onChange={(event) => setInputValue(event.target.value)}
                />
            </div>
        </div>
    );
}