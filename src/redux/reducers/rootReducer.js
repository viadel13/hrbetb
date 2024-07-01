import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  activeLink: null,
  userSession: null
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
        },

        session: (state, action) => {
          return{
            ...state,
            userSession: action.payload
          }
        }

    }
})

export const { menuActif, session } =  betbhrSlice.actions;


export default  betbhrSlice.reducer;