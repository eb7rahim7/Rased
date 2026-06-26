import { View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { post } from '../api/post';
import { toast } from '@backpackapp-io/react-native-toast';

const AddCustomerScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [customerName, setCustomerName] = useState('');
    const [mobile, setMobile] = useState('');
    const [creditLimit, setCreditLimit] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!customerName) {
            toast.error(t('required'));
            return;
        }

        setLoading(true);
        const sendData = {
            field_1ydd0pkoo6bdtko00fy: customerName,
            field_ok6ku0rdj62dx35y68o: mobile,
            field_jkwt9b9rvzlgyf0rz4e: parseFloat(creditLimit) || 0,
            field_dr7jjokkyzfkmugzkgj: 0,
            field_c4peyhuf33pdostvw9g: 0,
            field_wg7k9sbxsxh5ky1hh80: 0,
            field_s2bllwngk0hmalqfi1b: notes
        };

        const res = await post({ 
            path: 'application/6858/item_data?model=7&ignore_container=1&by_field_code=1&by_field_name=1&result_structure_short=1',
            sendData 
        });

        setLoading(false);

        if (res?.data?.data?.item_id) {
            toast.success(t('success'));
            navigation.goBack();
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.background }}
        >
            <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', flex: 1, textAlign: 'center', marginLeft: -39 }}>{t('addCustomer')}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('customerName')} *
                    </Text>
                    <TextInput
                        value={customerName}
                        onChangeText={setCustomerName}
                        placeholder={t('customerName')}
                        placeholderTextColor={theme.textSecondary}
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('mobile')}
                    </Text>
                    <TextInput
                        value={mobile}
                        onChangeText={setMobile}
                        placeholder="05xxxxxxxx"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="phone-pad"
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('creditLimit')}
                    </Text>
                    <TextInput
                        value={creditLimit}
                        onChangeText={setCreditLimit}
                        placeholder="0.00"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="decimal-pad"
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('notes')}
                    </Text>
                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder={t('notes')}
                        placeholderTextColor={theme.textSecondary}
                        multiline
                        numberOfLines={4}
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16, textAlignVertical: 'top' }}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={loading}
                    style={{ backgroundColor: theme.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 20 }}
                >
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                        {loading ? t('loading') : t('save')}
                    </Text>
                </TouchableOpacity>

                <View style={{ height: isSandBox ? 40 : 120 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddCustomerScreen;