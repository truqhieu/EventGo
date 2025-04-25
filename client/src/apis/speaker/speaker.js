import axios from "../../axios";


export const apiGetAllSpeaker = ()=>axios({
    url:'/speaker',
    method:'get'
})