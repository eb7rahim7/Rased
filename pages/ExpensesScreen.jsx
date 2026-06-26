import { View, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { get } from '../api/get';

const ExpensesScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchExpenses = async () => {
        try {
            const res = await get({ path: 'application/6858/item_brief?model=9&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            if (res?.data?.data) {
                setExpenses(res.data.data);
                setFilteredExpenses(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = expenses.filter(expense => 
                expense?.field_dc7qyew9zoeuljn3lrs?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                expense?.field_x678c2z0nzazcpiqbfn?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredExpenses(filtered);
        } else {
            setFilteredExpenses(expenses);
        }
    }, [searchQuery, expenses]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchExpenses();
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontSize: 16 }}>{t('loading')}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.primary }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15 }}>{t('expenses')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF20', borderRadius: 12, paddingHorizontal: 15 }}>
                    <Ionicons name="search" size={20} color="#FFFFFF" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder={t('search')}
                        placeholderTextColor="#FFFFFF80"
                        style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10, color: '#FFFFFF', fontSize: 16 }}
                    />
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={{ padding: 20 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
            >
                {filteredExpenses.length == 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Ionicons name="receipt-outline" size={80} color={theme.textSecondary} />
                        <Text style={{ fontSize: 18, color: theme.textSecondary, marginTop: 20 }}>{t('noData')}</Text>
                    </View>
                ) : (
                    filteredExpenses.map((expense) => (
                        <View
                            key={expense.id}
                            style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 5 }}>
                                        {expense?.field_dc7qyew9zoeuljn3lrs || t('expense')}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
                                        <Text style={{ fontSize: 14, color: theme.textSecondary, marginRight: 5 }}>
                                            {expense?.field_t85g181np3cb6j8q6oi || '-'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.error + '20', justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="trending-down" size={24} color={theme.error} />
                                </View>
                            </View>

                            <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 12 }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('expenseNumber')}</Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.text }}>
                                    {expense?.field_x678c2z0nzazcpiqbfn || '-'}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('description')}</Text>
                                <Text style={{ fontSize: 14, color: theme.text, flex: 1, textAlign: 'left', marginRight: 10 }} numberOfLines={2}>
                                    {expense?.field_lyj3lu0hlkejvnxyvps || '-'}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('amount')}</Text>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.error }}>
                                    {parseFloat(expense?.field_jznl7xtrt4igb21o8dn || 0).toFixed(2)} ر.س
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                <View style={{ height: isSandBox ? 40 : 120 }} />
            </ScrollView>

            <TouchableOpacity
                onPress={() => navigation.navigate('AddExpense')}
                style={{ position: 'absolute', bottom: isSandBox ? 60 : 140, left: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }}
            >
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

export default ExpensesScreen;