
import {configureStore} from '@reduxjs/toolkit'
import speakerSlice from '../reducer/speakerReducer'
import authenReducer from '../reducer/authenReducer'
// import event from '../../../server/models/event'
import EventReducer from '../reducer/eventReducer'

const store = configureStore({
    reducer:{
        speakerList : speakerSlice.reducer,
        authen      : authenReducer.reducer,
        event       : EventReducer.reducer,
    },
})

export default store