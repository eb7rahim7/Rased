import { View, ScrollView, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { get, del } from '../api/delete';
import { toast } from '@backpackapp-io/react-native-toast';

const SupplierDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const id = route.params?.id;
    const [supplier, setSupplier] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchSupplierData = async () => {
        try {
            const supplierRes = await get({ path: `application/6858/item_brief?model=4&id=${id}&result_structure_short=1&field_name=1&grid_unlimited_rows=1` });
            if (supplierRes?.data?.data?.[0]) {
                setSupplier(supplierRes.data.data[0]);
            }

            const purchasesRes = await get({ path: 'application/6858/item_brief?model=6&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            if (purchasesRes?.data?.data) {
                const supplierPurchases = purchasesRes.data.data.filter(p => p?.field_zc84ysor5o33vra8481?.id == id);
                setPurchases(supplierPurchases);
            }
        } catch (error) {
            console.error('Error fetching supplier data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchSupplierData();
        }
    }, [id]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchSupplierData();
    };

    const handleDelete = async () => {
        const res = await del({ path: `application/6858/item_data/${id}` });
        if (res?.data) {
            toast.success(t('success'));
            setShowDeleteModal(false);
            navigation.goBack();
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontSize: 16 }}>{t('loading')}</Text>
            </View>
        );
    }

    if (!supplier) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontSize: 16 }}>{t('noData')}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' }}>{t('supplierDetails')}</Text>
                <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
                    <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={{ padding: 20 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
            >
                
                <View style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: theme.primary + '20', justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                            <Ionicons name="person" size={30} color={theme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>
                                {supplier?.field_fabrv20g85ln5tnck4c || '-'}
                            </Text>
                        </View>
                    </View>

                    <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 15 }} />

                    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                        <Ionicons name="call-outline" size={18} color={theme.textSecondary} style={{ marginLeft: 10 }} />
                        <Text style={{ fontSize: 14, color: theme.textSecondary, flex: 1 }}>{t('mobile')}: </Text>
                        <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                            {supplier?.field_6nj61kfdso5uiiit2z7 || '-'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                        <Ionicons name="document-text-outline" size={18} color={theme.textSecondary} style={{ marginLeft: 10 }} />
                        <Text style={{ fontSize: 14, color: theme.textSecondary, flex: 1 }}>{t('taxNumber')}: </Text>
                        <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                            {supplier?.field_y2m0yk37wyr8049l3tr || '-'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name="location-outline" size={18} color={theme.textSecondary} style={{ marginLeft: 10 }} />
                        <Text style={{ fontSize: 14, color: theme.textSecondary, flex: 1 }}>{t('address')}: </Text>
                        <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600', flex: 2, textAlign: 'left' }}>
                            {supplier?.field_ww9w3iubmf29tzmar6q || '-'}
                        </Text>
                    </View>
                </View>

                <View style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 15 }}>{t('accountStatement')}</Text>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('totalPurchases')}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                            {parseFloat(supplier?.field_nw9hgmk1ofk18hbefaz || 0).toFixed(2)} ر.س
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('totalPaid')}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.success }}>
                            {parseFloat(supplier?.field_5aiks0ihod2j9bszdsu || 0).toFixed(2)} ر.س
                        </Text>
                    </View>

                    <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 12 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>{t('balance')}</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.error }}>
                            {parseFloat(supplier?.field_jas8c88hsj5su4gz0fu || 0).toFixed(2)} ر.س
                        </Text>
                    </View>
                </View>

                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 15 }}>{t('purchases')}</Text>

                {purchases.length == 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 30 }}>
                        <Ionicons name="cart-outline" size={60} color={theme.textSecondary} />
                        <Text style={{ fontSize: 16, color: theme.textSecondary, marginTop: 15 }}>{t('noData')}</Text>
                    </View>
                ) : (
                    purchases.map((purchase) => (
                        <View key={purchase.id} style={{ backgroundColor: theme.cardBg, borderRadius: 12, padding: 15, marginBottom: 12, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('invoiceNumber')}</Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.text }}>
                                    {purchase?.field_64g2rlqbdesga4r9s2t || '-'}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('invoiceDate')}</Text>
                                <Text style={{ fontSize: 14, color: theme.text }}>
                                    {purchase?.field_7is4vx6nv3upftwo55e || '-'}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('totalAmount')}</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.primary }}>
                                    {parseFloat(purchase?.field_1888hand8ef80a79gmk || 0).toFixed(2)} ر.س
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                <View style={{ height: isSandBox ? 40 : 120 }} />
            </ScrollView>

            <Modal visible={showDeleteModal} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>{t('confirm')}</Text>
                        <Text style={{ fontSize: 16, color: theme.textSecondary, marginBottom: 24 }}>{t('deleteConfirm')}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => setShowDeleteModal(false)}
                                style={{ flex: 1, backgroundColor: theme.border, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginLeft: 10 }}
                            >
                                <Text style={{ color: theme.text, fontSize: 16, fontWeight: 'bold' }}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDelete}
                                style={{ flex: 1, backgroundColor: theme.error, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginRight: 10 }}
                            >
                                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>{t('delete')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SupplierDetailsScreen;