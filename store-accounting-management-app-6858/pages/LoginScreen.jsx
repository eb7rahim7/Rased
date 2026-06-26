import { View, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useUser from '../contexts/useUser/useUser';
import { useNavigation } from '@react-navigation/native';
import { toast } from '@backpackapp-io/react-native-toast';

const LoginScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { handleLogIn } = useUser();
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!mobile || !password) {
            toast.error(t('required'));
            return;
        }

        setLoading(true);
        const result = await handleLogIn({ mobile, password });
        setLoading(false);

        if (result) {
            navigation.navigate('Dashboard');
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.background }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                    
                    <View style={{ marginBottom: 40, alignItems: 'center' }}>
                        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                            <Ionicons name="storefront" size={60} color={theme.surface} />
                        </View>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>{t('appName')}</Text>
                        <Text style={{ fontSize: 16, color: theme.textSecondary }}>{t('login')}</Text>
                    </View>

                    <View style={{ width: '100%', maxWidth: 400 }}>
                        
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('mobile')}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15 }}>
                                <Ionicons name="phone-portrait-outline" size={20} color={theme.textSecondary} />
                                <TextInput
                                    value={mobile}
                                    onChangeText={setMobile}
                                    placeholder="05xxxxxxxx"
                                    placeholderTextColor={theme.textSecondary}
                                    keyboardType="phone-pad"
                                    style={{ flex: 1, paddingVertical: 15, paddingHorizontal: 10, color: theme.text, fontSize: 16 }}
                                />
                            </View>
                        </View>

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('password')}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15 }}>
                                <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.textSecondary}
                                    secureTextEntry={!showPassword}
                                    style={{ flex: 1, paddingVertical: 15, paddingHorizontal: 10, color: theme.text, fontSize: 16 }}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            onPress={() => setRememberMe(!rememberMe)}
                            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}
                        >
                            <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: rememberMe ? theme.primary : theme.border, backgroundColor: rememberMe ? theme.primary : 'transparent', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                                {rememberMe && <Ionicons name="checkmark" size={16} color={theme.surface} />}
                            </View>
                            <Text style={{ fontSize: 14, color: theme.text }}>{t('rememberMe')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            style={{ backgroundColor: theme.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 20 }}
                        >
                            {loading ? (
                                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>{t('loading')}</Text>
                            ) : (
                                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>{t('login')}</Text>
                            )}
                        </TouchableOpacity>

                    </View>

                    <View style={{ position: 'absolute', bottom: 20 }}>
                        <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: 'center' }}>
                            {t('developer')} - {t('developerEmail')}
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: 'center', marginTop: 5 }}>
                            {t('allRightsReserved')}
                        </Text>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;