import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "./slices/fridgeSlice";
import type { RootState } from "./store";
import { FridgeItem } from "./FridgeItem";

export function Fridge() {
  const contents = useSelector((state: RootState) => state.fridge.contents)
  const dispatch = useDispatch();

  const [defaultName, defaultQty] = ['', 1];

  const [newItemName, setNewItemName] = useState(defaultName);
  const [newItemQty, setNewItemQty] = useState(defaultQty);

  function submitNewItem() {
    if (!newItemName || !newItemQty) {
        console.log('Please set a new item name and quantity')
        return;
    }

    dispatch(addItem({item: newItemName, quantity: newItemQty}));
    setNewItemName(defaultName);
    setNewItemQty(defaultQty);
  }
  
    return (
        <>
        <div className='the-fridge'>
            {contents.map((shelf) => (
                <div className='fridge-shelf'>
                    {shelf.map((item) => (
                        <FridgeItem item={item}></FridgeItem>
                    ))}
                </div>
        ))}
        </div>
        <input value={newItemName} onChange={(change) => setNewItemName(change.target.value)}></input>
        <input value={newItemQty} type='number' onChange={(change) => setNewItemQty(Number.parseInt(change.target.value))}></input>
        <button onClick={() => submitNewItem()}>Submit</button>
        <button onClick={() => dispatch(addItem({name: 'carrots', quantity: 1, shelfIndex: 0}))}>Add a Carrot</button>
        <button onClick={() => dispatch(removeItem({name: 'carrots', quantity: 1, shelfIndex: 0}))}>Remove a Carrot</button>
        </>
    )
}