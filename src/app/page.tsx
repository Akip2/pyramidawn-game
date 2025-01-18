"use client";

import MainMenu from "@/components/main-menu";
import {useSession} from "next-auth/react";
import {useEffect} from "react";

export default function Home() {
    const {data: session, status} = useSession();

    useEffect(() => {
        console.log(status);
        if(status=="authenticated") {
            console.log(session);
        }
    }, [status])

    return (
        <div className="w-screen h-screen flex justify-center">
            <MainMenu/>
        </div>
    );
}
