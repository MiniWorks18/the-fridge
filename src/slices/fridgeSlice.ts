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
        addItem(state, action: PayloadAction<FridgeItem>) {
            const item = action.payload;
            state.contents[0].push(item);
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
            if (!!state.contents[currentIndex+1]) {
                state.contents[currentIndex+1].push(item);
                state.contents[currentIndex] = state.contents[currentIndex].filter((i) => i.name !== item.name);
            }
        }
    }
})

export const {openDoor, closeDoor, addItem, removeItem, moveItemUp, moveItemDown} = fridgeSlice.actions;
export default fridgeSlice.reducer;