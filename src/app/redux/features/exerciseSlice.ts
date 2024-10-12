import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from "@/app/redux/store";

export interface Intensity {
    type: string;
    value: number;
}

export interface Exercise {
    order: number;
    day: number;
    week: number;
    type: string;
    name: string;
    sets: number;
    reps: number;
    intensity: Intensity;
    load: number;
    rest: string;
}

interface ExerciseState {
    exercises: Exercise[];
    loading: boolean;
    error: string | null;
}

const initialState: ExerciseState = {
    exercises: [],
    loading: false,
    error: null,
};

const exerciseSlice = createSlice({
    name: 'exercise',
    initialState,
    reducers: {
        fetchExercisesStart(state) {
            state.loading = true;
        },
        fetchExercisesSuccess(state, action: PayloadAction<Exercise[]>) {
            state.exercises = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchExercisesFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchExercisesStart, fetchExercisesSuccess, fetchExercisesFailure } = exerciseSlice.actions;

export const fetchExercisesThunk = (athlete: string, day: number, week: number, year: number): AppThunk => async (dispatch) => {
    dispatch(fetchExercisesStart());

    try {
        const response = await fetch("/api/getExercises", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ athlete, day, week, year }),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(fetchExercisesSuccess(data.exercises));
        } else {
            dispatch(fetchExercisesFailure(data.message));
        }
    } catch {
        dispatch(fetchExercisesFailure("Error while fetching exercises"));
    }
};

export default exerciseSlice.reducer;
