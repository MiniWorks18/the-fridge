import React, { useState } from "react";
import { moveItemDown, moveItemUp, type FridgeItem } from "./slices/fridgeSlice";
import { Button, Menu, MenuItem } from "@mui/material";
import { useDispatch } from "react-redux";

export function FridgeItem({item}) {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
    <>
        <button className='fridge-item flex items-center justify-center'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
         onClick={handleClick}>
            <div>
                {item.name}
            </div>
        </button>  
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => dispatch(moveItemUp(item))}>Move Up</MenuItem>
            <MenuItem onClick={() => dispatch(moveItemDown(item))}>Move Down</MenuItem>


            </Menu>

    </>
)
}