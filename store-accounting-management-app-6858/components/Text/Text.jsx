import React from 'react'
import { Text as MainText } from 'react-native'
import useLang from '../../contexts/useLang/useLang'

const Text = ({children , style , ...props}) => {
    const {lang} = useLang()
    var hasBold = style?.fontWeight == 'bold' || style?.fontWeight == '800' ? true : false
    return (
        <MainText
            {...props}
            style={[
                style,
                { 
                    direction: lang == 'ar' ? 'rtl' : 'ltr' ,
                    fontFamily: lang == 'ar' ? 'JF-Flat-medium' : '',
                    ...(hasBold ?
                        {
                            fontWeight: '600'
                        }
                    : {})
                }
            ]}
        >
            {children}
        </MainText>
    )
}

export default Text