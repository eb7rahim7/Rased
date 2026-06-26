import React, { createContext, useContext, useEffect, useState } from 'react'
import { mainConfig } from '../../mainConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

const ThemeContext = createContext()

export const ThemeProvider = ({children}) => {
    const [lod , setLod] = useState(true)
    const [theme , setTheme] = useState()
    const [mode , setMode] = useState(mainConfig?.defaultMode)

    const handleMode = (modeType) => {
        if(modeType == 'dark'){
            setMode('dark')
            setTheme(mainConfig?.dark)
        }else{
            setMode('light')
            setTheme(mainConfig?.light)
        }

        AsyncStorage.setItem('mode' , modeType)
    }

    const handleSetUpTheme = async () => {
        var tempMode = await AsyncStorage.getItem('mode')
        handleMode(tempMode || mainConfig?.defaultMode || 'dark')
    }

    useEffect(() => {
        setLod(true)
            handleSetUpTheme()
        setLod(false)
    },[])

    return (
        lod ? <View></View> : 
        <ThemeContext.Provider
        value={{theme , setTheme , mode , handleMode}}>
            {children}
        </ThemeContext.Provider>
    )
}

const useTheme = () => useContext(ThemeContext)

export default useTheme

