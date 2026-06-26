import React, { createContext, useContext, useState } from 'react'

const AppConfigContext = createContext()

export const AppConfigProvider = ({children}) => {
    const [isSandBox , setIsSandBox] = useState(false)

    return (
        <AppConfigContext.Provider value={{isSandBox}}>
            {children}
        </AppConfigContext.Provider>
    )
}



const useAppConfig = () => useContext(AppConfigContext)

export default useAppConfig

