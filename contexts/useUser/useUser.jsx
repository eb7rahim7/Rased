import React, { createContext, useContext, useState , useEffect} from 'react'
import { postSignIn, postSignup } from '../../apiCall/post'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DevSettings, View } from 'react-native'
import { putModelData } from '../../apiCall/put'
import { getModelData } from '../../apiCall/get'


const UserContext = createContext()

export const UserProvider = ({children}) => {

    const [user , setUser] = useState(null)
    const [lod , setLod] = useState(true)

    const handleUser = async () => {
        var luser = JSON.parse(await AsyncStorage.getItem('user'))
        try{
            setUser(luser)
        }catch(r){
            console.log('user error')
        }
        setLod(false)
    }

    const handleLogIn = async (values) => {
        let sendData = { ...values, sign_in_type: values?.email && values?.password ? "email_password" : 'email_otp'};
        const res = await postSignIn({ sendData });
    
        if (res?.data?.data) {
            var s_id = res?.res?.headers?.get('s_id')
            var jwt = res?.data?.meta?.token
            var getUser = await getModelData({modelId: 'app_guest'})
            var newUser = {...getUser?.data?.data?.find(i => i?.system_guest_id == res?.data?.data?.id) , jwt , s_id}
            AsyncStorage.setItem("jwt", jwt);
            AsyncStorage.setItem("s_id", s_id);
            AsyncStorage.setItem("user", JSON.stringify(newUser));
            setUser(newUser)
            return true
        }
        return false
    }
    
    const handleSignUp = async (values) => {
        var sendData = { ...values,mobile: values?.mobile?.replace(/\s+/g, '')  }
        Object.keys(sendData).forEach((key) => {
            if (sendData[key] === "" ||sendData[key] === undefined ||sendData[key] === null) {
            delete sendData[key];
            }
        });
        const res = await postSignup({sendData})
        return res ? true : false
    }

    const handleUpdateProfile = async (values) => {
        var sendData = { ...values}
        const res = await putModelData({id: user?.id,sendData , model: 'app_guest'})
        if(res){
            var getUser = await getModelData({modelId: 'app_guest'})
            var newUser = {...getUser?.data?.data?.find(i => i?.system_guest_id == user?.system_guest_id) , jwt:user?.jwt , s_id:user?.s_id}
            AsyncStorage.setItem("user", JSON.stringify(newUser));
            setUser(newUser)
            return true
        }
        return false
    }

    const LogOut = async () => {
        await AsyncStorage.clear()
        DevSettings.reload()
    }

    useEffect(() => {
        handleUser()
    },[])

    return (
        lod ? <View></View> :
        <UserContext.Provider value={{user , setUser , LogOut, handleSignUp, handleLogIn, handleUpdateProfile}}>
        {children}
        </UserContext.Provider>
    )
}



const useUser = () => useContext(UserContext)

export default useUser

