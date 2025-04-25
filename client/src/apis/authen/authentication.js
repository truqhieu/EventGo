import axios from '../../axios'


export const apiLogin = (email, password) =>
    axios({
      url: "/user/login",
      method: "post",
      data: { email, password }, // Gửi email và password như nguyên bản
    });

export const apiRegistation = (name,email,password)=>axios({
    url:'/user/register',
    method:'post',
    data:{name,email,password}
})

export const apiFinalRegistation = (token) => axios({
    url:`/user/finalregister/${token}`,
    method:'get'
})

export const apiGetCurrent=()=>axios({
    url:'/user/getcurrent',
    method:'get'
})


export const apiRefreshToken = ()=>axios({
    url:'/user/refreshtoken',
    method:'post'
})


