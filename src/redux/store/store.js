import {configureStore} from '@reduxjs/toolkit';
import  betbhrSliceReducer from '../reducers/rootReducer';


const store = configureStore({
    reducer:{
        betbhr: betbhrSliceReducer,
    }
    
});
  
export default store;