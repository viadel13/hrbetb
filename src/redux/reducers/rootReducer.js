import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  activeLink: false,
}

const betbhrSlice = createSlice({
    name: ' betbhrSlice',
    initialState,

    reducers: {
        menuActif: (state, action) => {
          return{
            ...state,
            activeLink: action.payload
          }
        }

    }
})

export const { menuActif } =  betbhrSlice.actions;


export default  betbhrSlice.reducer;