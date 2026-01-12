export const getToken =()=>{
    return localStorage.getItem("userToken")
}

export const getUserdata= ()=>localStorage.getItem('userToken')
export const userData = getUserdata() ? getUserdata() : null