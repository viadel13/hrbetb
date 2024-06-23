import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    datasEm: '454',
}

const betbhrSlice = createSlice({
    name: ' betbhrSlice',
    initialState,

    reducers: {
        supprimer: (state, action) => {
          return{
            ...state,
            pannier: 'bonjour'
          }
        }

    }
})

export const { supprimer } =  betbhrSlice.actions;


export default  betbhrSlice.reducer;