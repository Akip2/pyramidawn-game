'use client'

import PlayerContainer from "../../components/player-container";
import {socket} from "@/data/socket";
import React, {useCallback, useEffect} from "react";
import {useGame} from "@/context/game-provider";
import PlayerData from "@/data/player-data";
import {usePlayer} from "@/context/player-provider";
import {ActionType, useAction} from "@/context/action-provider";
import {useChoice} from "@/context/choice-provider";
import {useVote} from "@/context/vote-provider";
import IQuestion from "@/data/question/iquestion";
import DefaultQuestion from "@/data/question/default-question";
import EndQuestion from "@/data/question/end-question";
import {GameStatusEnum} from "@/enums/game-status.enum";
import {createRoleQuestion} from "@/data/question/role/role-factory";
import {ChoiceType} from "@/enums/choice-type.enum";
import {RoleEnum} from "@/enums/role.enum";
import SideTabs from "@/components/side-tabs";
import {ChatProvider} from "@/context/chat-provider";
import RevealQuestion from "@/data/question/reveal-question";

export default function GamePage() {
    const {
        roles,
        setRoles,
        players,
        setPlayers,
        phase,
        setPhase,
        setPhaseEndTime,
        killPlayer,
        addPlayer,
        makeAvatar,
        makePlayersWraith,
        setGameMaster
    } = useGame();
    const {setSelectNb, setAction, setActionType, clearSelectedPlayers, setUnselectableColors} = useAction();
    const {setVisibility, setChoiceType, setQuestion} = useChoice();
    const {addVote, removeVote, clearVotes} = useVote();
    const {isMummy, setRole} = usePlayer();

    const startingGame = useCallback(() => {
        setPhase("Starting");
        setPhaseEndTime(Date.now() + 10000);
    }, [setPhase, setPhaseEndTime])

    const death = useCallback((deathData: { victim: PlayerData, reason: string, role: RoleEnum }) => {
        killPlayer(deathData.victim, deathData.role);
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

        if (newPhase.name === "Starting") {
            startingGame();
        }
    }, [clearSelectedPlayers, clearVotes, setAction, setPhase, setPhaseEndTime, setVisibility, startingGame])

    const receiveRole = useCallback((role: RoleEnum) => {
        setRole(role);
        setChoiceType(ChoiceType.OK_BASIC);
        setQuestion(createRoleQuestion(role));
        setVisibility(true);
    }, [setChoiceType, setQuestion, setRole, setVisibility])

    const gameEnd = useCallback((data: { status: GameStatusEnum }) => {
        const status = data.status;
        let win: boolean | undefined;

        if (status === GameStatusEnum.VILLAGE_WIN) {
            win = !isMummy();
        } else if (status === GameStatusEnum.WRAITHS_WIN) {
            win = isMummy();
        }

        setQuestion(new EndQuestion(status, win));
        setChoiceType(ChoiceType.END);
        setVisibility(true);
    }, [isMummy, setChoiceType, setQuestion, setVisibility]);

    const action = useCallback((data: {
        actionName: string,
        selectNb: number,
        unselectableColors: string[],
        data: never
    }) => {
        setSelectNb(data.selectNb);
        setUnselectableColors(data.unselectableColors);
        const actionName = data.actionName;

        let question: IQuestion;
        if (actionName !== "vote") {
            setActionType(ActionType.POWER);
            switch (actionName) {
                case RoleEnum.SPHINX:
                    setChoiceType(ChoiceType.OK_ACTION);
                    question = new DefaultQuestion("Choose a player to protect for this night.");
                    break;

                case RoleEnum.RA:
                    setChoiceType(ChoiceType.OK_ACTION);
                    question = new DefaultQuestion("Reveal the role of a player.");
                    break;

                default:
                    question = new DefaultQuestion("Unknown");
            }
        } else {
            setActionType(ActionType.VOTE);
            setChoiceType(ChoiceType.OK_ACTION);
            question = new DefaultQuestion("Vote a player to eliminate.");
        }

        setQuestion(question);
        setVisibility(true);
    }, [setActionType, setChoiceType, setQuestion, setSelectNb, setUnselectableColors, setVisibility])

    const updateVotes = useCallback((voteData: { voter: PlayerData, unvoted: PlayerData, voted: PlayerData }) => {
        const voter = voteData.voter;
        const unvoted = voteData.unvoted;
        const voted = voteData.voted;

        if (unvoted != null) {
            removeVote(unvoted.color, voter);
        }

        if (voted != null) {
            addVote(voted.color, voter);
        }
    }, [addVote, removeVote]);

    const godSummon = useCallback((data: { avatar: PlayerData, godName: string }) => {
        makeAvatar(data.avatar, data.godName);
    }, [makeAvatar]);

    const reveal = useCallback((data: { name: string, color: string, role: string }) => {
        setChoiceType(ChoiceType.OK_BASIC);
        setQuestion(new RevealQuestion(new PlayerData(data.name, data.color), data.role));
        setVisibility(true);
        setTimeout(() => {
            setVisibility(true);
        }, 50);
    }, [setChoiceType, setQuestion, setVisibility]);

    useEffect(() => {
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
        socket.on("game-master", setGameMaster);
        socket.on("roles-change", setRoles);
        socket.on("reveal", reveal);

        return () => {
            socket.off("player-join", playerJoin);
            socket.off("player-leave", playerLeave);
            socket.off("phase-change", phaseChange);
            socket.off("role", receiveRole);
            socket.off("action", action);
            socket.off("vote-update", updateVotes);
            socket.off("death", death);
            socket.off("god-summoning", godSummon);
            socket.off("game-end", gameEnd);
            socket.off("wraith-players", makePlayersWraith);
            socket.off("game-master", setGameMaster);
            socket.off("roles-change", setRoles);
            socket.off("reveal", reveal);
        }
    }, [action, death, gameEnd, godSummon, makePlayersWraith, phaseChange, playerJoin, playerLeave, receiveRole, reveal, setGameMaster, setRoles, updateVotes]);

    useEffect(() => {
        if (phase === "Starting" && players.length < roles.length) {
            setPhase("Waiting");
        }
    }, [phase, players, roles, setPhase]);

    useEffect(() => {
        if(roles.length === players.length) {
            startingGame();
        }
    }, [players.length, roles.length, startingGame]);

    return (
        <ChatProvider>
            <div className="flex flex-row w-screen h-screen text-white">
                <SideTabs/>
                <PlayerContainer/>
            </div>
        </ChatProvider>
    );
}