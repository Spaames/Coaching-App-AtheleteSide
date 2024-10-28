"use client"

import DaySelector from "@/app/components/DaySelector";
import { useEffect, useState } from "react";
import { Block, getBlocksThunk, Exercise } from "@/app/redux/features/blockSlice";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import {
    Badge,
    Box, Card, CardBody, Heading
} from "@chakra-ui/react";
import ExerciseList from "@/app/components/ExerciseList";
import {getDay, getISOWeek, getYear} from "date-fns";


export default function Page() {
    const dispatch = useAppDispatch();
    const athlete = useAppSelector((state) => state.auth.user.username);
    const blockListStore = useAppSelector((state) => state.block.blocks);
    const [blockActual, setBlockActual] = useState<Block | null>(null);
    const [exercisesOfTheDay, setExercisesOfTheDay] = useState<Exercise[]>([]);

    useEffect(() => {
        if (athlete) {
            dispatch(getBlocksThunk(athlete));
        }
    }, [athlete, dispatch]);

    useEffect(() => {
        if (blockListStore && blockListStore.length > 0) {
            const today = new Date();
            const dayOfWeek = getDay(today) === 0 ? 7 : getDay(today);
            const weekOfYear = getISOWeek(today);
            const year = getYear(today);

            handleDateChange(dayOfWeek, weekOfYear, year);
        }
    }, [blockListStore]);


    const handleDateChange = (day: number, week: number, year: number) => {
        console.log(`Jour : ${day}, Semaine : ${week}-${year}`);
        console.log("Blocs :", blockListStore);

        if (!blockListStore) {
            console.log("Aucun bloc disponible.");
            setBlockActual(null);
            setExercisesOfTheDay([]);
            return;
        }

        const currentBlock = blockListStore.find(block => {
            const [startWeek, startYear] = block.start!.split('-').map(Number);
            const [endWeek, endYear] = block.end!.split('-').map(Number);
            return (
                startYear <= year && year <= endYear &&
                startWeek <= week && week <= endWeek
            );
        });

        setBlockActual(currentBlock || null);
        if (currentBlock) {
            console.log("Bloc actuel :", currentBlock);

            const exercises = currentBlock.exercises
                .filter(exercise => exercise.day === day && exercise.week === week)
                .sort((a, b) => a.order - b.order);

            setExercisesOfTheDay(exercises);
            console.log("Exercices du jour :", exercises);
        } else {
            console.log("Aucun bloc trouvé pour cette date.");
            setExercisesOfTheDay([]);
        }
    };


    return (
        <Box w="100%">
            <DaySelector onSelectDate={handleDateChange} />
            {blockActual ? (
                exercisesOfTheDay.length > 0 ? (
                    <ExerciseList exercises={exercisesOfTheDay} block={blockActual} />
                ) : (
                    <Box>
                        <Card>
                            <CardBody>
                                <Heading size='xs'><Badge> No sessions for this Day on block : {blockActual.name}</Badge></Heading>
                            </CardBody>
                        </Card>
                    </Box>
                )
            ) : (
                <Box>
                    <Card>
                        <CardBody>
                            <Heading size='xs'><Badge>No bloc on this date :/</Badge></Heading>
                        </CardBody>
                    </Card>
                </Box>
            )}
        </Box>
    );
}
