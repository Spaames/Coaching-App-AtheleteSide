"use client"

import { Box, HStack, Button, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { addDays, subDays, format, getISOWeek, getDay, getYear } from "date-fns";

const DaySelector = ({ onSelectDate }: { onSelectDate: (day: number, week: number, year: number) => void }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const generateDaysAround = (date: Date) => {
        return Array.from({ length: 7 }, (_, i) => addDays(subDays(date, 3), i));
    };

    const [daysOfWeek, setDaysOfWeek] = useState(generateDaysAround(selectedDate));

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);

        const dayOfWeek = getDay(date) === 0 ? 7 : getDay(date);
        const weekOfYear = getISOWeek(date);
        const year = getYear(date);

        onSelectDate(dayOfWeek, weekOfYear, year);

        setDaysOfWeek(generateDaysAround(date));
    };

    useEffect(() => {
        handleDateSelect(new Date());
    }, []);

    return (
        <Box w="100%" p={2}>
            <HStack justifyContent="center" alignItems="center" spacing={4}>
                <HStack overflowX="scroll" spacing={4}>
                    {daysOfWeek.map((date, index) => (
                        <Button
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            colorScheme={date.toDateString() === selectedDate.toDateString() ? "blue" : "gray"}
                            minW="80px"
                            flexShrink={0}
                        >
                            <Text fontSize="sm">{format(date, "EEE dd MMM")}</Text>
                        </Button>
                    ))}
                </HStack>
            </HStack>
        </Box>
    );
};

export default DaySelector;
