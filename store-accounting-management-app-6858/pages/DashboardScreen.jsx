import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useUser from '../contexts/useUser/useUser';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { get } from '../api/get';

const DashboardScreen = () => {
    const { theme } = useTheme();
    const { t } = useLang();
    const { user } = useUser();
    const { isSandBox } = useAppConfig();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        cashBalance: 0,
        cardBalance: 0,
        totalInventory: 0,
        suppliersDebts: 0,
        totalSales: 0,
        totalPurchases: 0,
        totalExpenses: 0,
        totalProfits: 0
    });
    const [storeSettings, setStoreSettings] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const cashflowRes = await get({ path: 'application/6858/item_brief?model=12&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            const productsRes = await get({ path: 'application/6858/item_brief?model=5&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            const suppliersRes = await get({ path: 'application/6858/item_brief?model=4&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            const salesRes = await get({ path: 'application/6858/item_brief?model=8&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            const purchasesRes = await get({ path: 'application/6858/item_brief?model=6&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            const expensesRes = await get({ path: 'application/6858/item_brief?model=9&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            const settingsRes = await get({ path: 'application/6858/item_brief?model=13&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });

            let cashBalance = 0;
            let cardBalance = 0;
            if (cashflowRes?.data?.data && cashflowRes.data.data.length > 0) {
                const latestCashflow = cashflowRes.data.data[0];
                cashBalance = parseFloat(latestCashflow?.field_g304ofapn9w3b3nnys3 || 0);
                cardBalance = parseFloat(latestCashflow?.field_ji52axki32x18rr4p53 || 0);
            }

            let totalInventory = 0;
            if (productsRes?.data?.data) {
                productsRes.data.data.forEach(product => {
                    const quantity = parseFloat(product?.field_t697t6uo4i1xbat2g66 || 0);
                    const purchasePrice = parseFloat(product?.field_nbc6erfj5n870216a6q || 0);
                    totalInventory += quantity * purchasePrice;
                });
            }

            let suppliersDebts = 0;
            if (suppliersRes?.data?.data) {
                suppliersRes.data.data.forEach(supplier => {
                    suppliersDebts += parseFloat(supplier?.field_jas8c88hsj5su4gz0fu || 0);
                });
            }

            let totalSales = 0;
            let totalProfits = 0;
            if (salesRes?.data?.data) {
                salesRes.data.data.forEach(sale => {
                    totalSales += parseFloat(sale?.field_b0lnde664bwijextyon || 0);
                    totalProfits += parseFloat(sale?.field_zhnwfjig1rts9orl4nn || 0);
                });
            }

            let totalPurchases = 0;
            if (purchasesRes?.data?.data) {
                purchasesRes.data.data.forEach(purchase => {
                    totalPurchases += parseFloat(purchase?.field_1888hand8ef80a79gmk || 0);
                });
            }

            let totalExpenses = 0;
            if (expensesRes?.data?.data) {
                expensesRes.data.data.forEach(expense => {
                    totalExpenses += parseFloat(expense?.field_jznl7xtrt4igb21o8dn || 0);
                });
            }

            if (settingsRes?.data?.data && settingsRes.data.data.length > 0) {
                setStoreSettings(settingsRes.data.data[0]);
            }

            setStats({
                cashBalance,
                cardBalance,
                totalInventory,
                suppliersDebts,
                totalSales,
                totalPurchases,
                totalExpenses,
                totalProfits
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    const StatCard = ({ title, value, icon, color, bgColor }) => (
        <View style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 8 }}>{title}</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: color || theme.text }}>{value.toFixed(2)} ر.س</Text>
                </View>
                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: bgColor || theme.primary + '20', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name={icon} size={30} color={color || theme.primary} />
                </View>
            </View>
        </View>
    );

    const totalLiquidity = stats.cashBalance + stats.cardBalance;
    const netFinancial = totalLiquidity + stats.totalInventory - stats.suppliersDebts + stats.totalProfits;

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontSize: 16 }}>{t('loading')}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView 
                contentContainerStyle={{ padding: 20, paddingTop: 50 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
            >
                
                <View style={{ backgroundColor: theme.primary, borderRadius: 20, padding: 25, marginBottom: 25, alignItems: 'center' }}>
                    {storeSettings?.field_d2xqqosscn99u5ghi6r?.file_url ? (
                        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: theme.surface, marginBottom: 15, overflow: 'hidden' }}>
                            <Image source={{ uri: storeSettings.field_d2xqqosscn99u5ghi6r.file_url }} style={{ width: '100%', height: '100%' }} />
                        </View>
                    ) : (
                        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: theme.surface, marginBottom: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons name="storefront" size={40} color={theme.primary} />
                        </View>
                    )}
                    <Text style={{ fontSize: 18, color: '#FFFFFF', marginBottom: 5 }}>{t('welcome')}</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' }}>
                        {storeSettings?.field_6nq9yzuscrubcvxqqij || t('appName')}
                    </Text>
                </View>

                <StatCard 
                    title={t('totalLiquidity')} 
                    value={totalLiquidity} 
                    icon="cash-outline" 
                    color="#2E7D32"
                    bgColor="#2E7D3220"
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                    <View style={{ flex: 1, marginLeft: 7.5 }}>
                        <View style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Ionicons name="cash" size={32} color="#4CAF50" style={{ marginBottom: 10 }} />
                                <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 5, textAlign: 'center' }}>{t('cashBalance')}</Text>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>{stats.cashBalance.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, marginRight: 7.5 }}>
                        <View style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Ionicons name="card" size={32} color="#2196F3" style={{ marginBottom: 10 }} />
                                <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 5, textAlign: 'center' }}>{t('cardBalance')}</Text>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>{stats.cardBalance.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <StatCard 
                    title={t('totalInventory')} 
                    value={stats.totalInventory} 
                    icon="cube-outline" 
                    color="#FF9800"
                    bgColor="#FF980020"
                />

                <StatCard 
                    title={t('suppliersDebts')} 
                    value={stats.suppliersDebts} 
                    icon="people-outline" 
                    color="#F44336"
                    bgColor="#F4433620"
                />

                <StatCard 
                    title={t('totalSales')} 
                    value={stats.totalSales} 
                    icon="trending-up-outline" 
                    color="#4CAF50"
                    bgColor="#4CAF5020"
                />

                <StatCard 
                    title={t('totalPurchases')} 
                    value={stats.totalPurchases} 
                    icon="cart-outline" 
                    color="#9C27B0"
                    bgColor="#9C27B020"
                />

                <StatCard 
                    title={t('totalExpenses')} 
                    value={stats.totalExpenses} 
                    icon="receipt-outline" 
                    color="#FF5722"
                    bgColor="#FF572220"
                />

                <StatCard 
                    title={t('totalProfits')} 
                    value={stats.totalProfits} 
                    icon="stats-chart-outline" 
                    color="#009688"
                    bgColor="#00968820"
                />

                <StatCard 
                    title={t('netFinancialStatus')} 
                    value={netFinancial} 
                    icon="wallet-outline" 
                    color="#1976D2"
                    bgColor="#1976D220"
                />

                <View style={{ height: isSandBox ? 40 : 120 }} />
            </ScrollView>
        </View>
    );
};

export default DashboardScreen;