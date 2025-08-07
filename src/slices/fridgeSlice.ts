import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { FridgeItem } from "../FridgeItem"

export type FridgeItem = {
    name: string,
    quantity: number,
    shelfIndex: number,
}

type FridgeState = {
    contents: FridgeItem[][],
    doorOpen: boolean
}

const defaultItems: FridgeItem[] = [
    {
        name: 'carrots',
        quantity: 1,
        shelfIndex: 0
    },
    {
        name: 'potatoes',
        quantity: 1,
        shelfIndex: 1
    },
    {
        name: 'eggs',
        quantity: 12,
        shelfIndex: 0
    }
]

const prepareFridgeItems = (items: FridgeItem[]): FridgeItem[][] => {
    if (!items.length) return [[]];

    const sortedItems: FridgeItem[][] = [];
    items.map((item) => {
        sortedItems[item.shelfIndex] = (sortedItems[item.shelfIndex] ?? []).concat(item)
    })
    console.log('Items', sortedItems)
    return sortedItems;
}

const initialState: FridgeState = {
    // TODO, up to here. Might need to use a useEffect or useCallback or something so the items can be dynamically altered
    contents: prepareFridgeItems(defaultItems),
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
        },
        moveItemUp(state, action: PayloadAction<{item: FridgeItem}>) {
            const {item} = action.payload;
            const currentIndex = state.contents.findIndex((shelf) => shelf.includes(item));
            if (currentIndex > 0) {
                state.contents[currentIndex-1] = [...state.contents[currentIndex-1], item]
                state.contents[currentIndex] = state.contents[currentIndex].filter((i) => i !== item)
            }
        },
        moveItemDown(state, action: PayloadAction<{item: FridgeItem}>) {
            const {item} = action.payload;
            const currentIndex = state.contents.findIndex((shelf) => shelf.includes(item));
            if (!!state.contents[currentIndex+1]) {
                state.contents[currentIndex+1] = [...state.contents[currentIndex+1], item];
                state.contents[currentIndex] = state.contents[currentIndex].filter((i) => i !== item);
            }
        }
    }
})

export const {openDoor, closeDoor, addItem, removeItem, moveItemUp, moveItemDown} = fridgeSlice.actions;
export default fridgeSlice.reducer;