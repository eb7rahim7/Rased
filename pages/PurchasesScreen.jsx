import { View, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { get } from '../api/get';

const PurchasesScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPurchases = async () => {
        try {
            const res = await get({ path: 'application/6858/item_brief?model=6&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            if (res?.data?.data) {
                setPurchases(res.data.data);
                setFilteredPurchases(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching purchases:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = purchases.filter(purchase => 
                purchase?.field_64g2rlqbdesga4r9s2t?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPurchases(filtered);
        } else {
            setFilteredPurchases(purchases);
        }
    }, [searchQuery, purchases]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPurchases();
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
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15 }}>{t('purchases')}</Text>
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
                {filteredPurchases.length == 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Ionicons name="cart-outline" size={80} color={theme.textSecondary} />
                        <Text style={{ fontSize: 18, color: theme.textSecondary, marginTop: 20 }}>{t('noData')}</Text>
                    </View>
                ) : (
                    filteredPurchases.map((purchase) => (
                        <View
                            key={purchase.id}
                            style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 5 }}>
                                        {t('invoiceNumber')}: {purchase?.field_64g2rlqbdesga4r9s2t || '-'}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
                                        <Text style={{ fontSize: 14, color: theme.textSecondary, marginRight: 5 }}>
                                            {purchase?.field_7is4vx6nv3upftwo55e || '-'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.warning + '20', justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="cart" size={24} color={theme.warning} />
                                </View>
                            </View>

                            <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 12 }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('supplierName')}</Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.text }}>
                                    {purchase?.field_zc84ysor5o33vra8481?.field_fabrv20g85ln5tnck4c || '-'}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('productName')}</Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.text }}>
                                    {purchase?.field_9ma1ftzatx39j4kdjla?.field_06piwpi7gx57wgd67le || '-'}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('quantity')}</Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.text }}>
                                    {parseFloat(purchase?.field_1hmqn6r9hid28cva92o || 0)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('totalAmount')}</Text>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.warning }}>
                                    {parseFloat(purchase?.field_1888hand8ef80a79gmk || 0).toFixed(2)} ر.س
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                <View style={{ height: isSandBox ? 40 : 120 }} />
            </ScrollView>

            <TouchableOpacity
                onPress={() => navigation.navigate('AddPurchase')}
                style={{ position: 'absolute', bottom: isSandBox ? 60 : 140, left: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }}
            >
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

export default PurchasesScreen;