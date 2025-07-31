import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type FridgeState = {
    contents: Record<string, number>,
    doorOpen: boolean
}

const initialState: FridgeState = {
    contents: {
        carrots: 1,
        potatoes: 2,
        milk: 3
    },
    doorOpen: false
}

const fridgeSlice = createSlice({
    name: 'fridge',
    initialState,
    reducers: {
        openDoor(state) {
            state.doorOpen = true;
        },
        closeDoor(state) {
            state.doorOpen = false;
        },
        addItem(state, action: PayloadAction<{item: string; quantity: number}>) {
            const {item, quantity} = action.payload;
            state.contents[item] = (state.contents[item] ?? 0) + quantity;
        },
        removeItem(state, action: PayloadAction<{item: string; quantity: number}>) {
            const {item, quantity} = action.payload;
            if (state.contents[item]) {
                state.contents[item] -= quantity;
                if (state.contents[item] <= 0) delete state.contents[item];
            }
        }
    }
})

export const {openDoor, closeDoor, addItem, removeItem} = fridgeSlice.actions;
export default fridgeSlice.reducer;