import { createSlice, current, type PayloadAction } from "@reduxjs/toolkit"
import { FridgeItem } from "../FridgeItem"
import type { WritableDraft } from "immer"

export type FridgeItem = {
    name: string,
    quantity: number,
    shelfIndex: number,
}

type FridgeState = {
    contents: FridgeItem[][],
    doorOpen: boolean
}

const maxNumberOfShelves = 3;

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

const findItemShelf = (state: WritableDraft<FridgeState>, item: FridgeItem): FridgeItem[] | undefined => {
    return state.contents.find(shelf => shelf.some((shelfItem) => shelfItem.name === item.name))
}

const findItem = (state: WritableDraft<FridgeState>, item: FridgeItem): FridgeItem | undefined => {
    const shelfWithItem = findItemShelf(state, item);
    return shelfWithItem?.find((shelfItem) => shelfItem.name === item.name);
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
        addItem(state, action: PayloadAction<FridgeItem>) {
            const item = action.payload;
            const shelfItem = findItem(state, item);
            if (shelfItem) {
                shelfItem.quantity += item.quantity;
            } else {
                state.contents[0].push(item);
            }
        },
        removeItem(state, action: PayloadAction<FridgeItem>) {
            const item = action.payload;
            const shelf = state.contents.find(shelf => shelf.some(shelfItem => shelfItem.name === item.name))
            if (shelf) {
                const targetItem = shelf.find(shelfItem => shelfItem.name === item.name)
                if (!targetItem) return;
                targetItem.quantity -= item.quantity;
                if (targetItem.quantity < 1) {
                    state.contents[state.contents.indexOf(shelf)] = shelf.filter((shelfItem) => shelfItem.name !== item.name)
                }
            }
        },
        moveItemUp(state, action: PayloadAction<FridgeItem>) {
            const item = action.payload;
            const currentIndex = state.contents.findIndex((shelf) => shelf.some(shelfItem => shelfItem.name === item.name));
            if (currentIndex > 0) {
                state.contents[currentIndex-1].push(item);
                state.contents[currentIndex] = state.contents[currentIndex].filter((i) => i.name !== item.name)
            }
        },
        moveItemDown(state, action: PayloadAction<FridgeItem>) {
            const item = action.payload;
            const currentIndex = state.contents.findIndex((shelf) => shelf.some(shelfItem => shelfItem.name === item.name));
            if (currentIndex+1 > maxNumberOfShelves) return;
            state.contents[currentIndex+1] = state.contents[currentIndex+1] ?? []
            state.contents[currentIndex+1].push(item);
            state.contents[currentIndex] = state.contents[currentIndex].filter((i) => i.name !== item.name);
        }
    }
})

export const {openDoor, closeDoor, addItem, removeItem, moveItemUp, moveItemDown} = fridgeSlice.actions;
export default fridgeSlice.reducer;