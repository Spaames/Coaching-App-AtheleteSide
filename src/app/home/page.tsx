"use client"

import DaySelector from "@/app/components/DaySelector";
import { useEffect, useState } from "react";
import { Block, getBlocksThunk, Exercise } from "@/app/redux/features/blockSlice";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";

export default function Page() {
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
        <div>
            <DaySelector onSelectDate={handleDateChange} />
            {blockActual && (
                <div>
                    <h2>Bloc actuel : {blockActual.name}</h2>
                    {/* Afficher les exercices du jour */}
                    <div>
                        <h3>Exercices du jour</h3>
                        {exercisesOfTheDay.length > 0 ? (
                            <ul>
                                {exercisesOfTheDay.map((exercise, index) => (
                                    <li key={index}>
                                        <strong>{exercise.name}</strong> : {exercise.sets} séries x {exercise.reps} reps, Intensité : {exercise.intensity?.value}, Charge : {exercise.load} kg, Repos : {exercise.rest}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Aucun exercice pour ce jour.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
