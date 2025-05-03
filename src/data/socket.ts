"use client";

import {io} from "socket.io-client";

console.log(process.env.NODE_ENV);

const backendUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : process.env.NEXT_PUBLIC_SOCKET_URL;
export const socket = io(backendUrl);