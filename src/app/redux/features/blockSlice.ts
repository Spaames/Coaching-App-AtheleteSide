import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from "@/app/redux/store";

export interface Intensity {
    type?: string | null;
    value?: number | null;
}

export interface Perf {
    set: number;
    reps: number;
    load: number;
    note: string;
}

export interface Exercise {
    type?: string;
    name?: string;
    sets?: number;
    indicatedReps?: string;
    intensity?: Intensity | null;
    indicatedLoad?: string;
    realPerf: Perf[];
    rest?: string;
    instructions?: string;
    day: number;
    week: number;
    order: number;
}

export interface Block {
    id?: string;
    name: string;
    start?: string;
    end?: string;
    athlete: string;
    exercises: Exercise[];
}

interface BlockState {
    blocks: Block[];
    loading: boolean;
    error: string | null;
}

const initialState: BlockState = {
    blocks: [],
    loading: false,
    error: null,
}

const blockSlice = createSlice({
    name: 'block',
    initialState,
    reducers: {
        getBlocksStart(state) {
            state.loading = true;
        },
        updateBlockStart(state) {
            state.loading = true;
        },
        getBlocksSuccess(state, action: PayloadAction<Block[]>) {
            state.error = null;
            state.loading = false;
            state.blocks = action.payload;

        },
        updateBlockSuccess(state, action: PayloadAction<Block>) {
            const index = state.blocks.findIndex(block => block.id === action.payload.id);
            if (index != -1) {
                state.blocks[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        getBlocksFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        updateBlockFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    getBlocksStart,
    getBlocksSuccess,
    getBlocksFailure,
    updateBlockStart,
    updateBlockSuccess,
    updateBlockFailure,
} = blockSlice.actions;


export const getBlocksThunk = (athlete: string): AppThunk => async (dispatch) => {
    dispatch(getBlocksStart());

    try {
        const response = await fetch("/api/getBlocks", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ athlete }),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(getBlocksSuccess(data.blockList));
        } else {
            dispatch(getBlocksFailure(data.message));
        }
    } catch {
        dispatch(getBlocksFailure("Error while fetching Blocks"));
    }
};

export const updateBlockThunk = (updatedBlock: Block): AppThunk => async (dispatch) => {
    dispatch(updateBlockStart());

    try {
        const response = await fetch("/api/updateBlock", {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBlock),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(updateBlockSuccess(updatedBlock));
            console.log(data.message);
        } else {
            dispatch(updateBlockFailure(data.message));
        }
    } catch {
        dispatch(updateBlockFailure("Error while updating block"));
    }
};

export default blockSlice.reducer;