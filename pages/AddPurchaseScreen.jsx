import { View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState, useEffect } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { post } from '../api/post';
import { get } from '../api/get';
import { toast } from '@backpackapp-io/react-native-toast';

const AddPurchaseScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [withTax, setWithTax] = useState(false);
    const [paidAmount, setPaidAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [taxPercentage, setTaxPercentage] = useState(15);

    useEffect(() => {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        setInvoiceDate(dateStr);
        const invoiceNum = 'PUR-' + Date.now();
        setInvoiceNumber(invoiceNum);
        
        fetchSuppliers();
        fetchProducts();
        fetchSettings();
    }, []);

    const fetchSuppliers = async () => {
        const res = await get({ path: 'application/6858/item_brief?model=4&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
        if (res?.data?.data) {
            setSuppliers(res.data.data);
        }
    };

    const fetchProducts = async () => {
        const res = await get({ path: 'application/6858/item_brief?model=5&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
        if (res?.data?.data) {
            setProducts(res.data.data);
        }
    };

    const fetchSettings = async () => {
        const res = await get({ path: 'application/6858/item_brief?model=13&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
        if (res?.data?.data && res.data.data.length > 0) {
            const tax = parseFloat(res.data.data[0]?.field_ii1wnja4cwwrr4n9knx || 15);
            setTaxPercentage(tax);
        }
    };

    const calculateTotal = () => {
        const qty = parseFloat(quantity) || 0;
        const price = parseFloat(unitPrice) || 0;
        let total = qty * price;
        
        let taxAmount = 0;
        if (withTax) {
            taxAmount = (total * taxPercentage) / 100;
            total = total + taxAmount;
        }
        
        return { total, taxAmount };
    };

    const handleSave = async () => {
        if (!selectedSupplier || !selectedProduct || !quantity || !unitPrice) {
            toast.error(t('required'));
            return;
        }

        const { total, taxAmount } = calculateTotal();

        setLoading(true);
        const sendData = {
            field_64g2rlqbdesga4r9s2t: invoiceNumber,
            field_zc84ysor5o33vra8481: selectedSupplier.id,
            field_7is4vx6nv3upftwo55e: invoiceDate,
            field_9ma1ftzatx39j4kdjla: selectedProduct.id,
            field_1hmqn6r9hid28cva92o: parseFloat(quantity),
            field_2flg9nkgtn4o3wqjbn8: parseFloat(unitPrice),
            field_1888hand8ef80a79gmk: total,
            field_ir9cvrogaqecuf2tqtm: withTax ? 'نعم' : 'لا',
            field_10pfhzuth327z7ssu18: taxAmount,
            field_vm2rxyifmro0s4ma10r: parseFloat(paidAmount) || 0,
            field_vystwz0fqyg9gs57ie5: notes
        };

        const res = await post({ 
            path: 'application/6858/item_data?model=6&ignore_container=1&by_field_code=1&by_field_name=1&result_structure_short=1',
            sendData 
        });

        setLoading(false);

        if (res?.data?.data?.item_id) {
            toast.success(t('success'));
            navigation.goBack();
        }
    };

    const { total, taxAmount } = calculateTotal();

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.background }}
        >
            <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', flex: 1, textAlign: 'center', marginLeft: -39 }}>{t('addPurchase')}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('invoiceNumber')}</Text>
                    <TextInput
                        value={invoiceNumber}
                        editable={false}
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.textSecondary, fontSize: 16 }}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => setShowSupplierModal(true)}
                    style={{ marginBottom: 20 }}
                >
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('selectSupplier')} *</Text>
                    <View style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: selectedSupplier ? theme.text : theme.textSecondary, fontSize: 16 }}>
                            {selectedSupplier?.field_fabrv20g85ln5tnck4c || t('selectSupplier')}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setShowProductModal(true)}
                    style={{ marginBottom: 20 }}
                >
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('selectProduct')} *</Text>
                    <View style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: selectedProduct ? theme.text : theme.textSecondary, fontSize: 16 }}>
                            {selectedProduct?.field_06piwpi7gx57wgd67le || t('selectProduct')}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
                    </View>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <View style={{ flex: 1, marginLeft: 7.5 }}>
                        <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('quantity')} *</Text>
                        <TextInput
                            value={quantity}
                            onChangeText={setQuantity}
                            placeholder="0"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="numeric"
                            style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                        />
                    </View>
                    <View style={{ flex: 1, marginRight: 7.5 }}>
                        <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('unitPrice')} *</Text>
                        <TextInput
                            value={unitPrice}
                            onChangeText={setUnitPrice}
                            placeholder="0.00"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="decimal-pad"
                            style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    onPress={() => setWithTax(!withTax)}
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
                >
                    <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: withTax ? theme.primary : theme.border, backgroundColor: withTax ? theme.primary : 'transparent', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                        {withTax && <Ionicons name="checkmark" size={16} color={theme.surface} />}
                    </View>
                    <Text style={{ fontSize: 14, color: theme.text }}>{t('withTax')} ({taxPercentage}%)</Text>
                </TouchableOpacity>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('paidAmount')}</Text>
                    <TextInput
                        value={paidAmount}
                        onChangeText={setPaidAmount}
                        placeholder="0.00"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="decimal-pad"
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('notes')}</Text>
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

                <View style={{ backgroundColor: theme.primary + '20', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, color: theme.text }}>{t('taxAmount')}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                            {taxAmount.toFixed(2)} ر.س
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>{t('totalAmount')}</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.primary }}>
                            {total.toFixed(2)} ر.س
                        </Text>
                    </View>
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

            <Modal visible={showSupplierModal} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: theme.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: theme.border }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>{t('selectSupplier')}</Text>
                            <TouchableOpacity onPress={() => setShowSupplierModal(false)}>
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {suppliers.map((supplier) => (
                                <TouchableOpacity
                                    key={supplier.id}
                                    onPress={() => {
                                        setSelectedSupplier(supplier);
                                        setShowSupplierModal(false);
                                    }}
                                    style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.border }}
                                >
                                    <Text style={{ fontSize: 16, color: theme.text }}>{supplier?.field_fabrv20g85ln5tnck4c}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal visible={showProductModal} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: theme.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: theme.border }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>{t('selectProduct')}</Text>
                            <TouchableOpacity onPress={() => setShowProductModal(false)}>
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {products.map((product) => (
                                <TouchableOpacity
                                    key={product.id}
                                    onPress={() => {
                                        setSelectedProduct(product);
                                        setShowProductModal(false);
                                    }}
                                    style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.border }}
                                >
                                    <Text style={{ fontSize: 16, color: theme.text }}>{product?.field_06piwpi7gx57wgd67le}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default AddPurchaseScreen;