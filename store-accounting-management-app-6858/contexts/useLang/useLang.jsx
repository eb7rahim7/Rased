import React, { createContext, useContext, useState } from 'react'
import { useEffect } from 'react'
import { mainConfig } from '../../mainConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

const allFiles = mainConfig?.langFiles || {}
const LangContext = createContext()

export const LangProvider = ({children}) => {
    const [lod , setLod] = useState(true)
    const [lang , setLang] = useState()

    const handleLang = (l) => {
       setLang(l)
       AsyncStorage.setItem('lang' , l)
    }

    const t = (key) => {
        return allFiles[lang]?.[key] || `${key}`
    }

    const handleSetUpLang = async () => {
        var tempMode = await AsyncStorage.getItem('lang')
        handleLang(tempMode || mainConfig?.defaultLang || 'en')
    }

    useEffect(() => {
        setLod(true)
            handleSetUpLang()
        setLod(false)
    },[])

    return (
        lod ? <View></View> : 
        <LangContext.Provider value={{lang , setLang , handleLang , t}}>
            {children}
        </LangContext.Provider>
    )
}



const useLang = () => useContext(LangContext)

export default useLang

