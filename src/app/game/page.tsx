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
import IQuestion from "@/data/question/iquestion";
import DefaultQuestion from "@/data/question/default-question";
import EndQuestion from "@/data/question/end-question";
import {GameStatus} from "@/data/game-status";

export default function GamePage() {
    const {roles, setRoles, players, setPlayers, phase, setPhase, setPhaseEndTime, killPlayer, addPlayer, makeAvatar, makePlayersWraith} = useGame();
    const {setSelectNb, setAction, setActionType, clearSelectedPlayers} = useAction();
    const {setVisibility, setChoiceType, setQuestion} = useChoice();
    const {addVote, removeVote, clearVotes} = useVote();
    const {isWraith, setRole, setColor} = usePlayer();

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
        if (addPlayer(player) === roles.length) {
            startingGame();
        }
    }, [addPlayer, roles.length, startingGame])

    const playerLeave = useCallback((player: PlayerData) => {
        setPlayers((prevPlayers) => prevPlayers.filter((p) => p.color !== player.color));
    }, [setPlayers])

    const phaseChange = useCallback((newPhase: { name: string, duration: number }) => {
        setPhaseEndTime(Date.now() + newPhase.duration * 1000);
        setPhase(newPhase.name);

        setAction(false);
        setVisibility(false);
        clearVotes();
        clearSelectedPlayers();
        clearVotes();
    }, [clearSelectedPlayers, clearVotes, setAction, setPhase, setPhaseEndTime, setVisibility])

    const receiveRole = useCallback((role: string) => {
        setRole(role);
    }, [setRole])

    const gameEnd = useCallback((data: {status: GameStatus}) => {
        const status = data.status;
        let win:boolean | undefined;

        if(status === GameStatus.VILLAGE_WIN) {
            win = !isWraith();
        } else if(status === GameStatus.WRAITHS_WIN) {
            win = isWraith();
        }
        
        setQuestion(new EndQuestion(status, win));
        setChoiceType(ChoiceType.END);
        setVisibility(true);
    }, [isWraith, setChoiceType, setQuestion, setVisibility]);

    const action = useCallback((data: { actionName: string, selectNb: number, data:never }) => {
        setSelectNb(data.selectNb);
        const actionName = data.actionName;

        let question: IQuestion;
        if (actionName !== "vote") {
            setActionType(ActionType.POWER);
            switch (actionName) {
                case "golem":
                    setChoiceType(ChoiceType.OK);
                    question = new DefaultQuestion("Choose a player to protect for this night.");
                    break;

                case "priest":
                    setChoiceType(ChoiceType.ACTIVATE_POWER);
                    question = new DefaultQuestion(`Summon ${data.data}?`);
                    break;

                case "ra":
                    setChoiceType(ChoiceType.ACTIVATE_POWER);
                    question = new DefaultQuestion(`Reveal the role of a player?`);
                    break;

                case "anubis":
                    setChoiceType(ChoiceType.ACTIVATE_POWER);
                    question = new DefaultQuestion(`Kill a player?`);
                    break;

                default:
                    question = new DefaultQuestion("Unknown");
            }
        } else {
            setActionType(ActionType.VOTE);
            setChoiceType(ChoiceType.OK);
            question = new DefaultQuestion("Vote a player to eliminate.");
        }

        setQuestion(question);
        setVisibility(true);
    }, [setActionType, setChoiceType, setQuestion, setSelectNb, setVisibility])

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
    }, [addVote, removeVote]);
    
    const godSummon = useCallback((data: {avatar: PlayerData, godName: string}) => {
        makeAvatar(data.avatar, data.godName);
    }, [makeAvatar]);

    useEffect(() => {
        socket.on("room-data", receiveRoomData);
        socket.on("player-join", playerJoin);
        socket.on("player-leave", playerLeave);
        socket.on("phase-change", phaseChange);
        socket.on("role", receiveRole);
        socket.on("action", action);
        socket.on("vote-update", updateVotes);
        socket.on("death", death);
        socket.on("god-summoning", godSummon);
        socket.on("game-end", gameEnd);
        socket.on("wraith-players", makePlayersWraith)

        return () => {
            socket.off("room-data", receiveRoomData);
            socket.off("player-join", playerJoin);
            socket.off("player-leave", playerLeave);
            socket.off("phase-change", phaseChange);
            socket.off("role", receiveRole);
            socket.off("action", action);
            socket.off("vote-update", updateVotes);
            socket.off("death", death);
            socket.off("god-summoning", godSummon);
            socket.off("game-end", gameEnd);
            socket.off("wraith-players", makePlayersWraith)
        }
    }, [action, death, gameEnd, godSummon, makePlayersWraith, phaseChange, playerJoin, playerLeave, receiveRole, receiveRoomData, updateVotes]);

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