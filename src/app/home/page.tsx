"use client"

import DaySelector from "@/app/components/DaySelector";
import { useEffect, useState } from "react";
import { Block, getBlocksThunk, Exercise } from "@/app/redux/features/blockSlice";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import {
    Box,
    Card, CardBody,
    CardHeader,
    Heading,
    HStack,
    Input, Stack, StackDivider,
    Table,
    TableContainer,
    Tbody,
    Td, Text, Textarea,
    Thead,
    Tr
} from "@chakra-ui/react";
import data from "@/lib/data.json";
import ExerciceList from "@/app/components/ExerciceList";


export default function Page() {
    const columns = data.blockHead;
    const dispatch = useAppDispatch();
    const athlete = useAppSelector((state) => state.auth.user.username);
    const blockListStore = useAppSelector((state) => state.block.blocks);
    const [blockActual, setBlockActual] = useState<Block | null>(null);
    const [exercisesOfTheDay, setExercisesOfTheDay] = useState<Exercise[]>([]);

    // Charger les blocs au premier rendu
    useEffect(() => {
        if (athlete) {
            dispatch(getBlocksThunk(athlete));
        }
    }, [athlete, dispatch]);

    // Gestion du changement de date
    const handleDateChange = (day: number, week: number, year: number) => {
        console.log(`Jour : ${day}, Semaine : ${week}-${year}`);
        console.log("Blocs :", blockListStore);

        // Logique pour récupérer le bloc actuel
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
            {blockActual && (
                <ExerciceList exercises={exercisesOfTheDay} />
            )}
        </Box>
    )

    /*return (
        <Box w="100%">
            <DaySelector onSelectDate={handleDateChange} />
            {blockActual && (
                <Card>
                    <CardHeader>
                        <Heading size="lg">
                            {blockActual.name}
                            {exercisesOfTheDay.length > 0 ? ("Week : " + exercisesOfTheDay[0].week) : ""}
                        </Heading>
                    </CardHeader>

                    <CardBody>
                        <Stack divider={<StackDivider />} spacing='4'>
                            {exercisesOfTheDay.length > 0 && (
                                exercisesOfTheDay.map((exercise, index) => (
                                    <Box key={index}>
                                        <Heading size='md'>
                                            {exercise.name + " -- " + exercise.sets + " x " + exercise.reps}
                                        </Heading>
                                        {exercise.sets !== undefined && (
                                            Array.from({ length: exercise.sets}, (_, index) => (
                                                <Text key={index} pt="2" fontSize="sm">
                                                    {exercise.name}
                                                </Text>
                                            ))
                                        )}
                                    </Box>
                                ))
                            )}
                        </Stack>
                    </CardBody>
                </Card>
            )}
        </Box>
    );

     */
}
