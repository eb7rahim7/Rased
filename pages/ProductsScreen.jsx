import { View, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { get } from '../api/get';

const ProductsScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await get({ path: 'application/6858/item_brief?model=5&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
            if (res?.data?.data) {
                setProducts(res.data.data);
                setFilteredProducts(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = products.filter(product => 
                product?.field_06piwpi7gx57wgd67le?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product?.field_sjl0ajl004k62x3qd9z?.includes(searchQuery)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchQuery, products]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
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
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15 }}>{t('products')}</Text>
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
                {filteredProducts.length == 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Ionicons name="cube-outline" size={80} color={theme.textSecondary} />
                        <Text style={{ fontSize: 18, color: theme.textSecondary, marginTop: 20 }}>{t('noData')}</Text>
                    </View>
                ) : (
                    filteredProducts.map((product) => {
                        const currentQuantity = parseFloat(product?.field_t697t6uo4i1xbat2g66 || 0);
                        const minStock = parseFloat(product?.field_n21zo108wc1ib1fdifd || 0);
                        const isLowStock = currentQuantity < minStock;

                        return (
                            <TouchableOpacity
                                key={product.id}
                                onPress={() => navigation.navigate('ProductDetails', { id: product.id })}
                                style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: isLowStock ? 2 : 0, borderColor: isLowStock ? theme.error : 'transparent' }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 5 }}>
                                            {product?.field_06piwpi7gx57wgd67le || '-'}
                                        </Text>
                                        {product?.field_sjl0ajl004k62x3qd9z && (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Ionicons name="barcode-outline" size={14} color={theme.textSecondary} />
                                                <Text style={{ fontSize: 12, color: theme.textSecondary, marginRight: 5 }}>
                                                    {product.field_sjl0ajl004k62x3qd9z}
                                                </Text>
                                            </View>
                                        )}
                                        {product?.field_s2svc7rg47taxeaexnm && (
                                            <View style={{ backgroundColor: theme.primary + '20', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start', marginTop: 5 }}>
                                                <Text style={{ fontSize: 12, color: theme.primary }}>
                                                    {product.field_s2svc7rg47taxeaexnm}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: isLowStock ? theme.error + '20' : theme.primary + '20', justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name={isLowStock ? "alert" : "cube"} size={24} color={isLowStock ? theme.error : theme.primary} />
                                    </View>
                                </View>

                                {isLowStock && (
                                    <View style={{ backgroundColor: theme.error + '20', borderRadius: 8, padding: 8, marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="warning" size={16} color={theme.error} style={{ marginLeft: 5 }} />
                                        <Text style={{ fontSize: 12, color: theme.error, flex: 1 }}>{t('lowStock')}</Text>
                                    </View>
                                )}

                                <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 12 }} />

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>{t('currentQuantity')}</Text>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: isLowStock ? theme.error : theme.text }}>
                                            {currentQuantity}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>{t('purchasePrice')}</Text>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.warning }}>
                                            {parseFloat(product?.field_nbc6erfj5n870216a6q || 0).toFixed(2)} ر.س
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>{t('salePrice')}</Text>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.success }}>
                                            {parseFloat(product?.field_1makstnx35ralithjbb || 0).toFixed(2)} ر.س
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}

                <View style={{ height: isSandBox ? 40 : 120 }} />
            </ScrollView>

            <TouchableOpacity
                onPress={() => navigation.navigate('AddProduct')}
                style={{ position: 'absolute', bottom: isSandBox ? 60 : 140, left: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }}
            >
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

export default ProductsScreen;