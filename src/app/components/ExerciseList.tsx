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

    return (
        <Box w="100%">
            {exercisesByType.map((group, index) => (
                <Card key={index} w="100%">
                    <CardHeader>
                        <Heading size='md'><Badge fontSize='1em'>{group.type}</Badge></Heading>
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
                                                                                    <option value="6,5">@6,5</option>
                                                                                    <option value="7">@7,0</option>
                                                                                    <option value="7.5">@7,5</option>
                                                                                    <option value="8">@8,0</option>
                                                                                    <option value="8,5">@8,5</option>
                                                                                    <option value="9">@9,0</option>
                                                                                    <option value="9,5">@9,5</option>
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
            <Button width="100%" onClick={handleSave} colorScheme="green" fontSize="sm">Save</Button>
        </Box>
    )
};

export default ExerciseList;
