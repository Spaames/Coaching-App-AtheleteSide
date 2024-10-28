import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Stack,
    Card,
    CardHeader,
    CardBody,
    Heading,
    Badge,
    StackDivider,
    TableContainer,
    Table,
    Thead,
    Th,
    Tr,
    Input,
    Tbody,
    Td,
    AccordionIcon, Button, Select
} from "@chakra-ui/react";
import {Block, Exercise, updateBlockThunk} from "@/app/redux/features/blockSlice";
import {useAppDispatch} from "@/app/redux/hooks";
import jsPDF from "jspdf";

interface ExerciseListProps {
    exercises: Exercise[];
    block: Block;
}

const ExerciseList = ({ exercises, block}: ExerciseListProps) => {
    const uniqueTypes = Array.from(new Set(exercises.map(exercise => exercise.type)));
    const dispatch = useAppDispatch();

    const exercisesByType = uniqueTypes.map(type => ({
        type,
        exercises: exercises.filter(exercise => exercise.type === type),
    }));

    const handleCreationExercises = (): Exercise[] => {
        const updatedExercises: Exercise[] = [];

        exercises.forEach(exercise => {
            const updatedSets = [];

            if (exercise.sets !== undefined) {
                for (let setIndex = 0; setIndex < exercise.sets; setIndex++) {
                    const repsId = `${exercise.name}-${setIndex}-reps`;
                    const loadId = `${exercise.name}-${setIndex}-load`;
                    const noteId = `${exercise.name}-${setIndex}-note`;
                    const rpeId = `${exercise.name}-${setIndex}-rpe`;
                    console.log(rpeId);

                    const set = setIndex + 1;
                    const reps = (document.getElementById(repsId) as HTMLInputElement)?.value;
                    const load = (document.getElementById(loadId) as HTMLInputElement)?.value;
                    const note = (document.getElementById(noteId) as HTMLInputElement)?.value;
                    const rpe = (document.getElementById(rpeId) as HTMLInputElement)?.value;

                    console.log(rpe);

                    updatedSets.push({
                        set: set,
                        reps: parseInt(reps),
                        load: parseInt(load),
                        rpe: parseFloat(rpe),
                        note: note,
                    });

                    console.log(updatedSets);
                }

                updatedExercises.push({
                    ...exercise,
                    realPerf: updatedSets,
                });
            }
        });

        return updatedExercises;
    };


    const handleSave = () => {
        const updatedExercises = handleCreationExercises();

        const updatedBlock = {
            ...block,
            exercises: updatedExercises,
        };

        dispatch(updateBlockThunk(updatedBlock));
    }

    const handleExportPdf = () => {
        const doc = new jsPDF();

        const updatedExercises: Exercise[] = handleCreationExercises();

        doc.setFontSize(18);
        doc.text("Session's overview", 20, 20);

        doc.setFontSize(12);
        let yOffset = 30;
        updatedExercises.forEach((exercise, index) => {
            doc.text(`${index + 1}. ${exercise.name}`, 20, yOffset);
            yOffset += 7;
            exercise.realPerf.forEach((realPerf) => {
                doc.text(`${realPerf.reps} x ${realPerf.load} -- @${realPerf.rpe}`, 20, yOffset);
                yOffset += 5;
            });
            yOffset += 5;
        });
        window.open(doc.output("bloburl"), "_blank");
    }

    const handleColor = (type: string): string => {
        switch (type) {
            case "Muscle-Up":
                return "#2D3748"
            case "Pull-Up":
                return "#975A16"
            case "Dips":
                return "#553C9A"
            case "Bench":
                return "#97266D"
            case "Deadlift":
                return "#9B2C2C"
            case "Squat":
                return "#2c5282"
            case "Figure":
                return "#0987A0"
            case "Accessories":
                return "#276749"
        }
        return "gray";
    }

    return (
        <Box w="100%">
            {exercisesByType.map((group, index) => (
                <Card key={index} w="100%">
                    <CardHeader>
                        {group.type ? (
                            <Heading size='md'><Badge backgroundColor={handleColor(group.type)} fontSize='1em'>{group.type}</Badge></Heading>
                        ) : (
                            <p>error</p>
                        )}
                    </CardHeader>
                    <CardBody>
                        <Stack spacing={4} divider={<StackDivider />}>
                            {group.exercises.map((exercise, idx) => (
                                <Box key={idx}>
                                    <Accordion allowToggle>
                                        <AccordionItem>
                                            <AccordionButton>
                                                <Heading size="xs" textTransform="uppercase">
                                                    {exercise.name + " : " + exercise.sets + " x " + exercise.indicatedReps }
                                                </Heading>
                                                <AccordionIcon />
                                            </AccordionButton>
                                            <AccordionPanel>
                                                <TableContainer>
                                                    <Table size="sm">
                                                        <Thead>
                                                            <Tr>
                                                                <Th>Set</Th>
                                                                <Th>Reps</Th>
                                                                <Th>{exercise.intensity?.type}</Th>
                                                                <Th>Load</Th>
                                                                <Th>RPE Perceived</Th>
                                                                <Th>Instructions</Th>
                                                                <Th>Notes</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {exercise.sets && (
                                                                Array.from({ length: exercise.sets }).map((_, index) => {
                                                                    const realPerfSet = exercise.realPerf?.find(perf => perf.set === index + 1);
                                                                    return (
                                                                        <Tr key={index}>
                                                                            <Td>{index + 1}</Td>
                                                                            <Td>
                                                                                <Input
                                                                                    id={`${exercise.name}-${index}-reps`}
                                                                                    defaultValue={realPerfSet?.reps || ""}
                                                                                    placeholder={exercise.indicatedReps}
                                                                                    minW={20}
                                                                                />
                                                                            </Td>
                                                                            <Td>{exercise.intensity?.value}</Td>
                                                                            <Td>
                                                                                <Input
                                                                                    id={`${exercise.name}-${index}-load`}
                                                                                    defaultValue={realPerfSet?.load || ""}
                                                                                    placeholder={exercise.indicatedLoad}
                                                                                    minW={20}
                                                                                />
                                                                            </Td>
                                                                            <Td>
                                                                                <Select
                                                                                    id={`${exercise.name}-${index}-rpe`}
                                                                                    minWidth="auto"
                                                                                >
                                                                                    <option value="n/a">--RPE--</option>
                                                                                    <option value="6">@6,0</option>
                                                                                    <option value="6.5">@6,5</option>
                                                                                    <option value="7">@7,0</option>
                                                                                    <option value="7.5">@7,5</option>
                                                                                    <option value="8">@8,0</option>
                                                                                    <option value="8.5">@8,5</option>
                                                                                    <option value="9">@9,0</option>
                                                                                    <option value="9.5">@9,5</option>
                                                                                    <option value="10">@10</option>
                                                                                </Select>
                                                                            </Td>
                                                                            <Td>{exercise.instructions}</Td>
                                                                            <Td>
                                                                                <Input
                                                                                    id={`${exercise.name}-${index}-note`}
                                                                                    defaultValue={realPerfSet?.note || ""}
                                                                                    placeholder="Note"
                                                                                    minW={20}
                                                                                />
                                                                            </Td>
                                                                        </Tr>
                                                                    );
                                                                })
                                                            )}
                                                        </Tbody>
                                                    </Table>
                                                </TableContainer>
                                            </AccordionPanel>
                                        </AccordionItem>
                                    </Accordion>
                                </Box>
                            ))}
                        </Stack>
                    </CardBody>
                </Card>
            ))}
            <Button width="100%" onClick={handleSave} colorScheme="green" fontSize="sm" mt={4}>Save</Button>
            <Button width={"100%"} onClick={handleExportPdf} colorScheme="blue" fontSize={"sm"} mt={4}>
                Exporter en PDF
            </Button>
        </Box>
    )
};

export default ExerciseList;
