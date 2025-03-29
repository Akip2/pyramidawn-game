'use client'

import Chat from "../../components/game/chat";
import PlayerContainer from "../../components/game/player-container";
import {socket} from "@/data/socket";
import React, {useCallback, useEffect} from "react";
import {useGame} from "@/context/game-provider";
import PlayerData from "@/data/player-data";
import {usePlayer} from "@/context/player-provider";
import {ActionType, useAction} from "@/context/action-provider";
import {ChoiceType, useChoice} from "@/context/choice-provider";
import {useVote} from "@/context/vote-provider";

export default function GamePage() {
    const {roles, setRoles, players, setPlayers, phase, setPhase, setPhaseEndTime, killPlayer} = useGame();
    const {setSelectNb, setAction, setActionType} = useAction();
    const {setVisibility, setChoiceType, setQuestion} = useChoice();
    const {addVote, removeVote, clearVotes} = useVote();
    const {setRole, setColor} = usePlayer();

    const startingGame = useCallback(() => {
        setPhase("Starting");
        setPhaseEndTime(Date.now() + 10000);
    }, [setPhase, setPhaseEndTime])

    const receiveRoomData = useCallback((data: { players: PlayerData[], roles: string[], phase: string }) => {
        setPlayers(data.players);
        setRoles(data.roles);
        setPhase(data.phase);
        
        const playerInfo = data.players[data.players.length - 1];
        setColor(playerInfo.color);

        if (data.phase === "Starting") {
            startingGame();
        }
    }, [setColor, setPhase, setPlayers, setRoles, startingGame])

    const death = useCallback((deathData: {victim: PlayerData, reason:string}) => {
        killPlayer(deathData.victim);
    }, [killPlayer])

    const playerJoin = useCallback((player: PlayerData) => {
        setPlayers((prevPlayers) => [...prevPlayers, player]);

        if (players.length == roles.length) {
            startingGame();
        }
    }, [players.length, roles.length, setPlayers, startingGame])

    const playerLeave = useCallback((player: PlayerData) => {
        setPlayers((prevPlayers) => prevPlayers.filter((p) => p.color !== player.color));
    }, [setPlayers])

    const phaseChange = useCallback((newPhase: { name: string, duration: number }) => {
        setPhaseEndTime(Date.now() + newPhase.duration * 1000);
        setPhase(newPhase.name);
    }, [setPhase, setPhaseEndTime])

    const receiveRole = useCallback((role: string) => {
        setRole(role);
    }, [setRole])

    const action = useCallback((data: { actionName: string, selectNb: number }) => {
        setSelectNb(data.selectNb);
        const actionName = data.actionName;

        let question: string;
        if (actionName !== "vote") {
            setActionType(ActionType.POWER);
            switch (actionName) {
                case "golem":
                    setChoiceType(ChoiceType.OK);
                    question = "Choose a player to protect for this night.";
                    break;

                case "priest":
                    setChoiceType(ChoiceType.ACTIVATE_POWER);
                    question = "Summon Anubis?";
                    break;

                default:
                    question = "Unknown";
            }
        } else {
            setActionType(ActionType.VOTE);
            setChoiceType(ChoiceType.OK);
            question = "Vote a player to eliminate.";
        }

        setQuestion(question);
        setVisibility(true);
    }, [setActionType, setChoiceType, setQuestion, setSelectNb, setVisibility])

    const stopAction = useCallback(() => {
        setAction(false);
        setVisibility(false);
        clearVotes();
    }, [clearVotes, setAction, setVisibility]);

    const updateVotes = useCallback((voteData: {voter: PlayerData, unvoted: PlayerData, voted: PlayerData}) => {
        const voter = voteData.voter;
        const unvoted = voteData.unvoted;
        const voted = voteData.voted;
        
        if(unvoted != null) {
            removeVote(unvoted.color, voter);
        }
        
        if(voted != null) {
            addVote(voted.color, voter);
        }
    }, [addVote, removeVote])

    useEffect(() => {
        socket.on("room-data", receiveRoomData);
        socket.on("player-join", playerJoin);
        socket.on("player-leave", playerLeave);
        socket.on("phase-change", phaseChange);
        socket.on("role", receiveRole);
        socket.on("action", action);
        socket.on("stop-action", stopAction);
        socket.on("vote-update", updateVotes);
        socket.on("death", death);

        return () => {
            socket.off("room-data", receiveRoomData);
            socket.off("player-join", playerJoin);
            socket.off("player-leave", playerLeave);
            socket.off("phase-change", phaseChange);
            socket.off("role", receiveRole);
            socket.off("action", action);
            socket.off("stop-action", stopAction);
            socket.off("vote-update", updateVotes);
            socket.off("death", death);
        }
    }, [action, death, phaseChange, playerJoin, playerLeave, receiveRole, receiveRoomData, stopAction, updateVotes]);

    useEffect(() => {
        if (phase === "Starting" && players.length < roles.length) {
            setPhase("Waiting");
        }
    }, [phase, players, roles, setPhase]);

    useEffect(() => {
        socket.emit("get-room-data");
    }, []);

    return (
        <div className="flex flex-row w-screen h-screen text-white">
            <Chat/>
            <PlayerContainer/>
        </div>
    );
}