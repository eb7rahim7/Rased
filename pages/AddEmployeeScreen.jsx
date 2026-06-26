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

const AddEmployeeScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [employeeName, setEmployeeName] = useState('');
    const [mobile, setMobile] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [salary, setSalary] = useState('');
    const [allowance, setAllowance] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!employeeName || !salary) {
            toast.error(t('required'));
            return;
        }

        setLoading(true);
        const sendData = {
            field_66e18ep99ft3swghps8: employeeName,
            field_faz6nq6vedxab67lmfo: mobile,
            field_1yhcfwet6q3kcp00bac: jobTitle,
            field_y2j3yak3q8tcs5dqp3y: parseFloat(salary),
            field_78uws9af9akom3nj96q: parseFloat(allowance) || 0,
            field_eytwapa21j2bymfheeg: 0,
            field_2bu113h3ljuku0urhhc: 0,
            field_ecaaka4ls2cdeyot0hj: 0,
            field_68uhxurcg6r5ndjwqzy: notes
        };

        const res = await post({ 
            path: 'application/6858/item_data?model=10&ignore_container=1&by_field_code=1&by_field_name=1&result_structure_short=1',
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
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', flex: 1, textAlign: 'center', marginLeft: -39 }}>{t('addEmployee')}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('employeeName')} *
                    </Text>
                    <TextInput
                        value={employeeName}
                        onChangeText={setEmployeeName}
                        placeholder={t('employeeName')}
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
                        {t('jobTitle')}
                    </Text>
                    <TextInput
                        value={jobTitle}
                        onChangeText={setJobTitle}
                        placeholder={t('jobTitle')}
                        placeholderTextColor={theme.textSecondary}
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                    />
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <View style={{ flex: 1, marginLeft: 7.5 }}>
                        <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                            {t('salary')} *
                        </Text>
                        <TextInput
                            value={salary}
                            onChangeText={setSalary}
                            placeholder="0.00"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="decimal-pad"
                            style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                        />
                    </View>
                    <View style={{ flex: 1, marginRight: 7.5 }}>
                        <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                            {t('allowance')}
                        </Text>
                        <TextInput
                            value={allowance}
                            onChangeText={setAllowance}
                            placeholder="0.00"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="decimal-pad"
                            style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                        />
                    </View>
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

export default AddEmployeeScreen;