import { View, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { get } from '../api/get';

const EmployeesScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchEmployees = async () => {
        try {
            const res = await get({ path: 'application/6858/item_brief?model=10&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            if (res?.data?.data) {
                setEmployees(res.data.data);
                setFilteredEmployees(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = employees.filter(employee => 
                employee?.field_66e18ep99ft3swghps8?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                employee?.field_faz6nq6vedxab67lmfo?.includes(searchQuery)
            );
            setFilteredEmployees(filtered);
        } else {
            setFilteredEmployees(employees);
        }
    }, [searchQuery, employees]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchEmployees();
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
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15 }}>{t('employees')}</Text>
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
                {filteredEmployees.length == 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Ionicons name="people-outline" size={80} color={theme.textSecondary} />
                        <Text style={{ fontSize: 18, color: theme.textSecondary, marginTop: 20 }}>{t('noData')}</Text>
                    </View>
                ) : (
                    filteredEmployees.map((employee) => (
                        <View
                            key={employee.id}
                            style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 5 }}>
                                        {employee?.field_66e18ep99ft3swghps8 || '-'}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                        <Ionicons name="briefcase-outline" size={14} color={theme.textSecondary} />
                                        <Text style={{ fontSize: 14, color: theme.textSecondary, marginRight: 5 }}>
                                            {employee?.field_1yhcfwet6q3kcp00bac || '-'}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="call-outline" size={14} color={theme.textSecondary} />
                                        <Text style={{ fontSize: 14, color: theme.textSecondary, marginRight: 5 }}>
                                            {employee?.field_faz6nq6vedxab67lmfo || '-'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.info + '20', justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="person" size={24} color={theme.info} />
                                </View>
                            </View>

                            <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 12 }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>{t('salary')}</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                                        {parseFloat(employee?.field_y2j3yak3q8tcs5dqp3y || 0).toFixed(2)} ر.س
                                    </Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>{t('balance')}</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.primary }}>
                                        {parseFloat(employee?.field_ecaaka4ls2cdeyot0hj || 0).toFixed(2)} ر.س
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}

                <View style={{ height: isSandBox ? 40 : 120 }} />
            </ScrollView>

            <TouchableOpacity
                onPress={() => navigation.navigate('AddEmployee')}
                style={{ position: 'absolute', bottom: isSandBox ? 60 : 140, left: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }}
            >
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

export default EmployeesScreen;