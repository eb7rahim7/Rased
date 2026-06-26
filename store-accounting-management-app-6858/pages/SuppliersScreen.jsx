import { View, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { get } from '../api/get';

const SuppliersScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSuppliers = async () => {
        try {
            const res = await get({ path: 'application/6858/item_brief?model=4&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            if (res?.data?.data) {
                setSuppliers(res.data.data);
                setFilteredSuppliers(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = suppliers.filter(supplier => 
                supplier?.field_fabrv20g85ln5tnck4c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                supplier?.field_6nj61kfdso5uiiit2z7?.includes(searchQuery)
            );
            setFilteredSuppliers(filtered);
        } else {
            setFilteredSuppliers(suppliers);
        }
    }, [searchQuery, suppliers]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchSuppliers();
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
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15 }}>{t('suppliers')}</Text>
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
                {filteredSuppliers.length == 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Ionicons name="people-outline" size={80} color={theme.textSecondary} />
                        <Text style={{ fontSize: 18, color: theme.textSecondary, marginTop: 20 }}>{t('noData')}</Text>
                    </View>
                ) : (
                    filteredSuppliers.map((supplier) => (
                        <TouchableOpacity
                            key={supplier.id}
                            onPress={() => navigation.navigate('SupplierDetails', { id: supplier.id })}
                            style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 5 }}>
                                        {supplier?.field_fabrv20g85ln5tnck4c || '-'}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="call-outline" size={14} color={theme.textSecondary} />
                                        <Text style={{ fontSize: 14, color: theme.textSecondary, marginRight: 5 }}>
                                            {supplier?.field_6nj61kfdso5uiiit2z7 || '-'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.primary + '20', justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="person" size={24} color={theme.primary} />
                                </View>
                            </View>

                            <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 12 }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>{t('totalPurchases')}</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                                        {parseFloat(supplier?.field_nw9hgmk1ofk18hbefaz || 0).toFixed(2)} ر.س
                                    </Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>{t('totalPaid')}</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.success }}>
                                        {parseFloat(supplier?.field_5aiks0ihod2j9bszdsu || 0).toFixed(2)} ر.س
                                    </Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>{t('balance')}</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.error }}>
                                        {parseFloat(supplier?.field_jas8c88hsj5su4gz0fu || 0).toFixed(2)} ر.س
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                <View style={{ height: isSandBox ? 40 : 120 }} />
            </ScrollView>

            <TouchableOpacity
                onPress={() => navigation.navigate('AddSupplier')}
                style={{ position: 'absolute', bottom: isSandBox ? 60 : 140, left: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }}
            >
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

export default SuppliersScreen;