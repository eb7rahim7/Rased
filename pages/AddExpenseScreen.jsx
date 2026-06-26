import { View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { post } from '../api/post';
import { toast } from '@backpackapp-io/react-native-toast';

const AddExpenseScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [expenseNumber, setExpenseNumber] = useState('');
    const [expenseDate, setExpenseDate] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(16);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        setExpenseDate(dateStr);
        const expNum = 'EXP-' + Date.now();
        setExpenseNumber(expNum);
    }, []);

    const handleSave = async () => {
        if (!category || !amount) {
            toast.error(t('required'));
            return;
        }

        setLoading(true);
        const sendData = {
            field_x678c2z0nzazcpiqbfn: expenseNumber,
            field_t85g181np3cb6j8q6oi: expenseDate,
            field_dc7qyew9zoeuljn3lrs: category,
            field_jznl7xtrt4igb21o8dn: parseFloat(amount),
            field_lyj3lu0hlkejvnxyvps: description,
            field_0dcugl8sk26shgyqk45: paymentMethod,
            field_aptus3sodvlhbu80cov: notes
        };

        const res = await post({ 
            path: 'application/6858/item_data?model=9&ignore_container=1&by_field_code=1&by_field_name=1&result_structure_short=1',
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
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', flex: 1, textAlign: 'center', marginLeft: -39 }}>{t('addExpense')}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('expenseNumber')}</Text>
                    <TextInput
                        value={expenseNumber}
                        editable={false}
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.textSecondary, fontSize: 16 }}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('category')} *
                    </Text>
                    <TextInput
                        value={category}
                        onChangeText={setCategory}
                        placeholder={t('category')}
                        placeholderTextColor={theme.textSecondary}
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('amount')} *
                    </Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="decimal-pad"
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('description')}
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder={t('description')}
                        placeholderTextColor={theme.textSecondary}
                        multiline
                        numberOfLines={3}
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16, textAlignVertical: 'top' }}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('paymentMethod')}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                            onPress={() => setPaymentMethod(16)}
                            style={{ flex: 1, backgroundColor: paymentMethod == 16 ? theme.primary : theme.inputBg, borderRadius: 12, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: paymentMethod == 16 ? theme.primary : theme.border }}
                        >
                            <Text style={{ color: paymentMethod == 16 ? '#FFFFFF' : theme.text, fontSize: 16, fontWeight: '600' }}>
                                {t('cashMethod')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setPaymentMethod(17)}
                            style={{ flex: 1, backgroundColor: paymentMethod == 17 ? theme.primary : theme.inputBg, borderRadius: 12, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: paymentMethod == 17 ? theme.primary : theme.border }}
                        >
                            <Text style={{ color: paymentMethod == 17 ? '#FFFFFF' : theme.text, fontSize: 16, fontWeight: '600' }}>
                                {t('cardMethod')}
                            </Text>
                        </TouchableOpacity>
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
                        numberOfLines={3}
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

export default AddExpenseScreen;