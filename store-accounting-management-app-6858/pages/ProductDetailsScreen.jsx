import { View, ScrollView, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { get } from '../api/get';
import { del } from '../api/delete';
import { toast } from '@backpackapp-io/react-native-toast';

const ProductDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const id = route.params?.id;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchProductData = async () => {
        try {
            const productRes = await get({ path: `application/6858/item_brief?model=5&id=${id}&result_structure_short=1&field_name=1&grid_unlimited_rows=1` });
            if (productRes?.data?.data?.[0]) {
                setProduct(productRes.data.data[0]);
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProductData();
        }
    }, [id]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchProductData();
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

    if (!product) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontSize: 16 }}>{t('noData')}</Text>
            </View>
        );
    }

    const currentQuantity = parseFloat(product?.field_t697t6uo4i1xbat2g66 || 0);
    const minStock = parseFloat(product?.field_n21zo108wc1ib1fdifd || 0);
    const isLowStock = currentQuantity < minStock;

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' }}>{t('productDetails')}</Text>
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
                        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: isLowStock ? theme.error + '20' : theme.primary + '20', justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                            <Ionicons name={isLowStock ? "alert" : "cube"} size={30} color={isLowStock ? theme.error : theme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>
                                {product?.field_06piwpi7gx57wgd67le || '-'}
                            </Text>
                            {product?.field_s2svc7rg47taxeaexnm && (
                                <View style={{ backgroundColor: theme.primary + '20', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start', marginTop: 5 }}>
                                    <Text style={{ fontSize: 12, color: theme.primary }}>
                                        {product.field_s2svc7rg47taxeaexnm}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {isLowStock && (
                        <View style={{ backgroundColor: theme.error + '20', borderRadius: 8, padding: 12, marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="warning" size={20} color={theme.error} style={{ marginLeft: 10 }} />
                            <Text style={{ fontSize: 14, color: theme.error, flex: 1 }}>{t('lowStock')} - الكمية المتوفرة أقل من الحد الأدنى</Text>
                        </View>
                    )}

                    <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 15 }} />

                    {product?.field_sjl0ajl004k62x3qd9z && (
                        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                            <Ionicons name="barcode-outline" size={18} color={theme.textSecondary} style={{ marginLeft: 10 }} />
                            <Text style={{ fontSize: 14, color: theme.textSecondary, flex: 1 }}>{t('barcode')}: </Text>
                            <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                                {product.field_sjl0ajl004k62x3qd9z}
                            </Text>
                        </View>
                    )}

                    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                        <Ionicons name="pricetag-outline" size={18} color={theme.textSecondary} style={{ marginLeft: 10 }} />
                        <Text style={{ fontSize: 14, color: theme.textSecondary, flex: 1 }}>{t('purchasePrice')}: </Text>
                        <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                            {parseFloat(product?.field_nbc6erfj5n870216a6q || 0).toFixed(2)} ر.س
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                        <Ionicons name="cash-outline" size={18} color={theme.textSecondary} style={{ marginLeft: 10 }} />
                        <Text style={{ fontSize: 14, color: theme.textSecondary, flex: 1 }}>{t('salePrice')}: </Text>
                        <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                            {parseFloat(product?.field_1makstnx35ralithjbb || 0).toFixed(2)} ر.س
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                        <Ionicons name="cube-outline" size={18} color={theme.textSecondary} style={{ marginLeft: 10 }} />
                        <Text style={{ fontSize: 14, color: theme.textSecondary, flex: 1 }}>{t('currentQuantity')}: </Text>
                        <Text style={{ fontSize: 14, color: isLowStock ? theme.error : theme.text, fontWeight: '600' }}>
                            {currentQuantity}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name="alert-circle-outline" size={18} color={theme.textSecondary} style={{ marginLeft: 10 }} />
                        <Text style={{ fontSize: 14, color: theme.textSecondary, flex: 1 }}>{t('minStockAlert')}: </Text>
                        <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                            {minStock}
                        </Text>
                    </View>
                </View>

                <View style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 15 }}>إحصائيات المنتج</Text>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text style={{ fontSize: 14, color: theme.textSecondary }}>قيمة المخزون</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                            {(currentQuantity * parseFloat(product?.field_nbc6erfj5n870216a6q || 0)).toFixed(2)} ر.س
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text style={{ fontSize: 14, color: theme.textSecondary }}>هامش الربح المتوقع</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.success }}>
                            {(parseFloat(product?.field_1makstnx35ralithjbb || 0) - parseFloat(product?.field_nbc6erfj5n870216a6q || 0)).toFixed(2)} ر.س
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 14, color: theme.textSecondary }}>نسبة الربح</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.primary }}>
                            {parseFloat(product?.field_nbc6erfj5n870216a6q || 0) > 0
                                ? (((parseFloat(product?.field_1makstnx35ralithjbb || 0) - parseFloat(product?.field_nbc6erfj5n870216a6q || 0)) / parseFloat(product?.field_nbc6erfj5n870216a6q || 1)) * 100).toFixed(2)
                                : '0.00'}%
                        </Text>
                    </View>
                </View>

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

export default ProductDetailsScreen;