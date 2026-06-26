import { View, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { get } from '../api/get';

const SalesScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSales = async () => {
        try {
            const res = await get({ path: 'application/6858/item_brief?model=8&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            if (res?.data?.data) {
                setSales(res.data.data);
                setFilteredSales(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching sales:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = sales.filter(sale => 
                sale?.field_4yq0xawgxn74d83htwj?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredSales(filtered);
        } else {
            setFilteredSales(sales);
        }
    }, [searchQuery, sales]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchSales();
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
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15 }}>{t('sales')}</Text>
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
                {filteredSales.length == 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Ionicons name="receipt-outline" size={80} color={theme.textSecondary} />
                        <Text style={{ fontSize: 18, color: theme.textSecondary, marginTop: 20 }}>{t('noData')}</Text>
                    </View>
                ) : (
                    filteredSales.map((sale) => (
                        <TouchableOpacity
                            key={sale.id}
                            style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 5 }}>
                                        {t('invoiceNumber')}: {sale?.field_4yq0xawgxn74d83htwj || '-'}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
                                        <Text style={{ fontSize: 14, color: theme.textSecondary, marginRight: 5 }}>
                                            {sale?.field_o59dv5rhj9g12yhso1d || '-'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.success + '20', justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="receipt" size={24} color={theme.success} />
                                </View>
                            </View>

                            <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 12 }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('customerName')}</Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.text }}>
                                    {sale?.field_m5rpgv2hicypbeblash?.field_1ydd0pkoo6bdtko00fy || t('cash')}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('totalAmount')}</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.primary }}>
                                    {parseFloat(sale?.field_b0lnde664bwijextyon || 0).toFixed(2)} ر.س
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('profit')}</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.success }}>
                                    {parseFloat(sale?.field_zhnwfjig1rts9orl4nn || 0).toFixed(2)} ر.س
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                <View style={{ height: isSandBox ? 40 : 120 }} />
            </ScrollView>

            <TouchableOpacity
                onPress={() => navigation.navigate('AddSale')}
                style={{ position: 'absolute', bottom: isSandBox ? 60 : 140, left: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }}
            >
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

export default SalesScreen;