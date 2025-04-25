import {createAsyncThunk,createSlice} from '@reduxjs/toolkit'
import { apiGetAllSpeaker } from '../apis/speaker/speaker'

export const fetchDataSpeaker = createAsyncThunk(
    'getallspeaker',async () =>{        
        const response = await apiGetAllSpeaker()        
        
        return response        
    }
)

const speakerSlice = createSlice({
    name:'getallspeaker',
    initialState:{
        isLoading:false,
        error:null,
        dataSpeakerAll:[]
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchDataSpeaker.pending,(state)=>{
            state.isLoading=true
        })

        .addCase(fetchDataSpeaker.fulfilled,(state,action)=>{
            state.isLoading=false
            state.dataSpeakerAll= action.payload.data
        })

        .addCase(fetchDataSpeaker.rejected,(state,action)=>{
            state.isLoading=false
            state.error=action.error.message
        })
    }
})

export default speakerSlice
