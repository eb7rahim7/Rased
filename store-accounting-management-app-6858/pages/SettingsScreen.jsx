import { View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useUser from '../contexts/useUser/useUser';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { get } from '../api/get';
import { toast } from '@backpackapp-io/react-native-toast';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { theme, mode, handleMode } = useTheme();
    const { t } = useLang();
    const { user, LogOut } = useUser();
    const { isSandBox } = useAppConfig();
    const [storeSettings, setStoreSettings] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);

    useEffect(() => {
        fetchStoreSettings();
    }, []);

    const fetchStoreSettings = async () => {
        const res = await get({ path: 'application/6858/item_brief?model=13&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
        if (res?.data?.data && res.data.data.length > 0) {
            setStoreSettings(res.data.data[0]);
        }
    };

    const handleLogout = () => {
        LogOut();
        setShowLogoutModal(false);
        navigation.navigate('Login');
    };

    const toggleSection = (section) => {
        if (expandedSection == section) {
            setExpandedSection(null);
        } else {
            setExpandedSection(section);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.primary }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' }}>{t('settings')}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                
                <TouchableOpacity
                    onPress={() => toggleSection('store')}
                    style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.primary + '20', justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                                <Ionicons name="storefront" size={20} color={theme.primary} />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>{t('storeSettings')}</Text>
                        </View>
                        <Ionicons 
                            name={expandedSection == 'store' ? "chevron-up" : "chevron-down"} 
                            size={20} 
                            color={theme.textSecondary} 
                        />
                    </View>
                    {expandedSection == 'store' && storeSettings && (
                        <View style={{ marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: theme.border }}>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 5 }}>{t('storeName')}</Text>
                                <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                                    {storeSettings?.field_6nq9yzuscrubcvxqqij || '-'}
                                </Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 5 }}>{t('taxNumber')}</Text>
                                <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                                    {storeSettings?.field_p9lklxf2ls2pwjtw7dc || '-'}
                                </Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 5 }}>{t('mobile')}</Text>
                                <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                                    {storeSettings?.field_so9p1tujjjtcf4zzwxa || '-'}
                                </Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 5 }}>{t('email')}</Text>
                                <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                                    {storeSettings?.field_vp4vgfr57oa2eqlav2g || '-'}
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 5 }}>{t('taxPercentage')}</Text>
                                <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                                    {storeSettings?.field_ii1wnja4cwwrr4n9knx || '15'}%
                                </Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => toggleSection('darkMode')}
                    style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.primary + '20', justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                                <Ionicons name={mode == 'dark' ? "moon" : "sunny"} size={20} color={theme.primary} />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>{t('darkMode')}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleMode(mode == 'light' ? 'dark' : 'light')}
                            style={{ width: 50, height: 28, borderRadius: 14, backgroundColor: mode == 'dark' ? theme.primary : theme.border, padding: 2, justifyContent: 'center' }}
                        >
                            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF', alignSelf: mode == 'dark' ? 'flex-start' : 'flex-end' }} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => toggleSection('about')}
                    style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.primary + '20', justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                                <Ionicons name="information-circle" size={20} color={theme.primary} />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>{t('about')}</Text>
                        </View>
                        <Ionicons 
                            name={expandedSection == 'about' ? "chevron-up" : "chevron-down"} 
                            size={20} 
                            color={theme.textSecondary} 
                        />
                    </View>
                    {expandedSection == 'about' && (
                        <View style={{ marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: theme.border }}>
                            <Text style={{ fontSize: 14, color: theme.text, marginBottom: 10, textAlign: 'center' }}>
                                {t('appName')}
                            </Text>
                            <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 8, textAlign: 'center' }}>
                                نظام متكامل لإدارة حسابات المحلات التجارية
                            </Text>
                            <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 8, textAlign: 'center' }}>
                                {t('developer')}
                            </Text>
                            <Text style={{ fontSize: 12, color: theme.primary, marginBottom: 8, textAlign: 'center' }}>
                                {t('developerEmail')}
                            </Text>
                            <Text style={{ fontSize: 10, color: theme.textSecondary, textAlign: 'center' }}>
                                {t('appVersion')}: {storeSettings?.field_y827nbrwo1af5xukil3 || '1.0.0'}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setShowLogoutModal(true)}
                    style={{ backgroundColor: theme.error, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="log-out" size={24} color="#FFFFFF" style={{ marginLeft: 10 }} />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }}>{t('logout')}</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ height: isSandBox ? 40 : 120 }} />
            </ScrollView>

            <Modal visible={showLogoutModal} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: theme.error + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                                <Ionicons name="log-out" size={30} color={theme.error} />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>
                                {t('logout')}
                            </Text>
                            <Text style={{ fontSize: 14, color: theme.textSecondary, textAlign: 'center' }}>
                                هل أنت متأكد من تسجيل الخروج؟
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => setShowLogoutModal(false)}
                                style={{ flex: 1, backgroundColor: theme.border, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginLeft: 10 }}
                            >
                                <Text style={{ color: theme.text, fontSize: 16, fontWeight: 'bold' }}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleLogout}
                                style={{ flex: 1, backgroundColor: theme.error, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginRight: 10 }}
                            >
                                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>{t('confirm')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SettingsScreen;