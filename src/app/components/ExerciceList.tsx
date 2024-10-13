import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Text,
    Stack,
    HStack,
    Card, CardHeader, CardBody, Heading, Badge, StackDivider, TableContainer, Table, Thead, Th, Tr, Input, Tbody, Td
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { Exercise } from "@/app/redux/features/blockSlice";

interface ExerciseListProps {
    exercises: Exercise[];
}

const ExerciseList = ({ exercises }: ExerciseListProps) => {
    const uniqueTypes = Array.from(new Set(exercises.map(exercise => exercise.type)));

    const exercisesByType = uniqueTypes.map(type => ({
        type,
        exercises: exercises.filter(exercise => exercise.type === type),
    }));

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
                                    <Heading size="xs" textTransform="uppercase">
                                        {exercise.name + " : " + exercise.sets + " x " + exercise.reps }
                                    </Heading>
                                    <TableContainer>
                                        <Table size="sm">
                                            <Thead>
                                                <Tr>
                                                    <Th>Set</Th>
                                                    <Th>Reps</Th>
                                                    <Th>{exercise.intensity?.type}</Th>
                                                    <Th>Load</Th>
                                                    <Th>Instructions</Th>
                                                    <Th>Notes</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {exercise.sets && (
                                                    Array.from({ length: exercise.sets}).map((_, index) => (
                                                        <Tr key={index}>
                                                            <Td>{index+1}</Td>
                                                            <Td>{exercise.reps}</Td>
                                                            <Td>{exercise.intensity?.value}</Td>
                                                            <Td>
                                                                <Input
                                                                    defaultValue={exercise.load}
                                                                    maxW={20}
                                                                />
                                                            </Td>
                                                            <Td>{exercise.instructions}</Td>
                                                            <Td>
                                                                <Input
                                                                    placeholder="Notes"
                                                                />
                                                            </Td>
                                                        </Tr>
                                                        )))}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            ))}
                        </Stack>
                    </CardBody>
                </Card>
            ))}
        </Box>
    )

    /*return (
        <Accordion allowToggle>
            {exercises.map((exercise, index) => (
                <AccordionItem key={index}>
                    <AccordionButton>
                        <Box flex="1" textAlign="left">
                            <HStack>
                                <Text fontWeight="bold">{exercise.name}</Text>
                                <Text>
                                    {exercise.sets} x {exercise.reps}
                                </Text>
                            </HStack>
                        </Box>
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <Stack spacing={3}>
                            <Text>Intensity: {exercise.intensity?.value}</Text>
                            <Text>Load: {exercise.load} kg</Text>
                            <Text>Rest Time: {exercise.rest} seconds</Text>
                            <Text>Instructions: {exercise.instructions}</Text>
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );

     */
};

export default ExerciseList;
