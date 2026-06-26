import React from 'react'
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import { NavigationContainer, useIsFocused, useRoute } from '@react-navigation/native';
import { mainRoutes } from './routes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { checkEvenOdd } from './utility/globalFun';
import useTheme from './contexts/useTheme/useTheme';
import useLang from './contexts/useLang/useLang';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useUser from './contexts/useUser/useUser';

const RoutingHandler = () => {
    const {theme , mode} = useTheme()
    const {lang} = useLang()
    const insets = useSafeAreaInsets();
    const {user} = useUser()
    
    const renderTabBar = ({ routeName, selectedTab, navigate }) => {
        var currentRoute = mainRoutes?.find(i => i?.routeName == routeName)
        
        return (
        <TouchableOpacity
            onPress={() => navigate(routeName)}
            style={{
                ...styles.tabbarItem,
                ...(!user && currentRoute?.user_permission ? {
                    display: 'none'
                } : {})
            }}
        >
            <Ionicons
                name={currentRoute?.icon || 'home'}
                size={28}
                color={routeName === selectedTab ? theme?.tabBarActiveIconColor : theme?.tabBarUnActiveIconColor}
            />
        </TouchableOpacity>
        );
    };

    return (
    <View
    style={{
        direction: lang == 'ar' ? 'rtl' : 'ltr',
        flex: 1,
        paddingBottom: insets.bottom
    }}
    >
        <StatusBar style='auto'/>
        <NavigationContainer>
            <CurvedBottomBarExpo.Navigator
            type="TOP"
            height={60}
            circleWidth={50}
            bgColor={theme?.tabBarBg || '#1A1A1A'}
            borderWidth={1}
            borderColor={mode == 'dark' ? 'rgba(102, 102, 102, 0.4)' : 'rgba(77, 77, 77, 0.4)'}
            initialRouteName={mainRoutes?.find(i => i?.is_main)?.routeName}
            borderTopLeftRight
            tabBar={renderTabBar}
            screenOptions={{
                headerShown: false,
            }}
            shadowStyle={{
                // pointerEvents: 'none',
            }}
            style={{
                marginBottom: -1,
            }}
            renderCircle={({ selectedTab, navigate }) => {
                var isHomePage = mainRoutes?.find(i => i?.is_main)
                isHomePage = isHomePage && isHomePage?.routeName == selectedTab
                return(
                <TouchableOpacity
                    onPress={() => navigate(mainRoutes?.find(i => i?.is_main)?.routeName)}
                    style={{
                        marginTop: -22,
                        ...(isHomePage ? {
                            backgroundColor: selectedTab ? theme?.tabBarActiveIconColor : theme?.tabBarUnActiveIconColor,
                            borderRadius: '50%',
                            height: 50,
                            width: 50,
                            alignItems: 'center',
                            justifyContent: 'center'
                        } : {})
                    }}
                >
                    <Ionicons
                        name={mainRoutes?.find(i => i?.is_main)?.icon || 'home'}
                        size={30}
                        color={
                            selectedTab == mainRoutes?.find(i => i?.is_main)?.routeName ? 
                            'white' 
                            : theme?.tabBarUnActiveIconColor
                        }
                    />
                </TouchableOpacity>
                )
            }}
            >
                {mainRoutes?.map((page , index) => {
                    return(
                        <CurvedBottomBarExpo.Screen
                            key={index}
                            name={`${page?.routeName}`}
                            component={() => {
                                return(
                                    <RemountOnFocus>
                                        <page.component />
                                    </RemountOnFocus>
                                )
                            }}
                            position={
                                !page?.show_bot_bar || page?.is_main ? 'NONE' : 
                                ((page?.position) || (checkEvenOdd(index) == 'Even' ? 'LEFT' : 'RIGHT'))
                            }
                        />
                    )
                })}
            </CurvedBottomBarExpo.Navigator>
        </NavigationContainer>
    </View>
    )
}

export default RoutingHandler

const RemountOnFocus = ({ children }) => {
    const isFocused = useIsFocused();
    const rout = useRoute()
    return (
        isFocused &&
        <React.Fragment 
        key={rout?.params ? JSON.stringify(rout?.params)?.slice(0 , 35) : ''}
        >
            {children}
        </React.Fragment>
    )
};

const styles = StyleSheet.create({
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -5,
    // width: 30,
    // backgroundColor: 'red'
  },
});
