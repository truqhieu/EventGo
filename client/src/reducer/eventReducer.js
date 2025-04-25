import {createAsyncThunk,createSlice} from '@reduxjs/toolkit'
import { apiGetAllEvent } from '../apis/event/event'


export const fetchAllEvent = createAsyncThunk('eventall',
    async (_,{rejectWithValue})=>{
    try {
      const response = await apiGetAllEvent()    
      
      return response
    } catch (error) {
        rejectWithValue(error)
    }
})

const EventReducer = createSlice({
    name:'eventall',
    initialState:{
        eventAll :[],
        errorEventAll: null,
        loadingEventAll:false
    },
    reducers:{

    },
    extraReducers: (builder)=>{
        builder
        .addCase(fetchAllEvent.pending, (state)=>{
            state.loadingEventAll=true
        })

        .addCase(fetchAllEvent.fulfilled, (state,action)=>{
            state.loadingEventAll=false
            state.eventAll=action.payload
        })

        .addCase(fetchAllEvent.rejected, (state,action)=>{
            state.loadingEventAll = false
            state.errorEventAll = action.error.message
        })
    }
})

export default EventReducer