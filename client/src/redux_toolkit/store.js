
import { configureStore } from '@reduxjs/toolkit'
import speakerSlice from '../reducer/speakerReducer'
import authenReducer from '../reducer/authenReducer'
// import event from '../../../server/models/event'
import EventReducer from '../reducer/eventReducer'
import userReducer from "../reducer/userReducer";

const store = configureStore({
    reducer: {
        speakerList: speakerSlice.reducer,
        authen: authenReducer.reducer,
        event: EventReducer.reducer,
        user: userReducer,
    },
})

export default store