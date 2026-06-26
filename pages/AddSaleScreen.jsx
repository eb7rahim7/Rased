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

const AddSaleScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [discount, setDiscount] = useState('0');
    const [withTax, setWithTax] = useState(false);
    const [paymentType, setPaymentType] = useState(11);
    const [paymentMethod, setPaymentMethod] = useState(13);
    const [cashAmount, setCashAmount] = useState('');
    const [cardAmount, setCardAmount] = useState('');
    const [cashier, setCashier] = useState('');
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [taxPercentage, setTaxPercentage] = useState(15);

    useEffect(() => {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        setInvoiceDate(dateStr);
        const invoiceNum = 'INV-' + Date.now();
        setInvoiceNumber(invoiceNum);
        
        fetchCustomers();
        fetchProducts();
        fetchSettings();
    }, []);

    const fetchCustomers = async () => {
        const res = await get({ path: 'application/6858/item_brief?model=7&result_structure_short=1&field_name=1&grid_unlimited_rows=1' });
        if (res?.data?.data) {
            setCustomers(res.data.data);
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
        const disc = parseFloat(discount) || 0;
        let total = (qty * price) - disc;
        
        let taxAmount = 0;
        if (withTax) {
            taxAmount = (total * taxPercentage) / 100;
            total = total + taxAmount;
        }
        
        return { total, taxAmount };
    };

    const calculateProfit = () => {
        const qty = parseFloat(quantity) || 0;
        const salePrice = parseFloat(unitPrice) || 0;
        const purchasePrice = parseFloat(selectedProduct?.field_nbc6erfj5n870216a6q || 0);
        return (salePrice - purchasePrice) * qty;
    };

    const handleSave = async () => {
        if (!selectedProduct || !quantity || !unitPrice) {
            toast.error(t('required'));
            return;
        }

        const { total, taxAmount } = calculateTotal();
        const profit = calculateProfit();

        setLoading(true);
        const sendData = {
            field_4yq0xawgxn74d83htwj: invoiceNumber,
            field_o59dv5rhj9g12yhso1d: invoiceDate,
            field_m5rpgv2hicypbeblash: selectedCustomer?.id || null,
            field_bfke78sf3spohid0n0n: selectedProduct.id,
            field_2mleusnlguut4750fwa: parseFloat(quantity),
            field_qt9tdl9jler2k0i0zgf: parseFloat(unitPrice),
            field_x69ygne46m1jjbe0fjn: parseFloat(discount) || 0,
            field_b0lnde664bwijextyon: total,
            field_8j3qxoa7b4o0etq9h7n: withTax ? 'نعم' : 'لا',
            field_64dl3adlt5liy0ef3ii: taxAmount,
            field_wf5tbi5ijfafsrep2vl: paymentType,
            field_6svbdxu8jkp0jijxydt: paymentMethod,
            field_0qitftwu5bokt46fxut: paymentMethod == 15 ? parseFloat(cashAmount) || 0 : (paymentMethod == 13 ? total : 0),
            field_musl9n2fxhdylta9ugt: paymentMethod == 15 ? parseFloat(cardAmount) || 0 : (paymentMethod == 14 ? total : 0),
            field_zhnwfjig1rts9orl4nn: profit,
            field_1lpg8594qsql4vctxz1: cashier,
            field_55th4ngksu6vkzvqrqg: 'BRC-' + Date.now()
        };

        const res = await post({ 
            path: 'application/6858/item_data?model=8&ignore_container=1&by_field_code=1&by_field_name=1&result_structure_short=1',
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
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', flex: 1, textAlign: 'center', marginLeft: -39 }}>{t('addSale')}</Text>
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
                    onPress={() => setShowCustomerModal(true)}
                    style={{ marginBottom: 20 }}
                >
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('selectCustomer')}</Text>
                    <View style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: selectedCustomer ? theme.text : theme.textSecondary, fontSize: 16 }}>
                            {selectedCustomer?.field_1ydd0pkoo6bdtko00fy || t('selectCustomer')}
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

                {selectedProduct && (
                    <View style={{ backgroundColor: theme.primary + '20', borderRadius: 12, padding: 15, marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: theme.text }}>{t('salePrice')}</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.primary }}>
                                {parseFloat(selectedProduct?.field_1makstnx35ralithjbb || 0).toFixed(2)} ر.س
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 14, color: theme.text }}>{t('currentQuantity')}</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                                {parseFloat(selectedProduct?.field_t697t6uo4i1xbat2g66 || 0)}
                            </Text>
                        </View>
                    </View>
                )}

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
                            onChangeText={(text) => {
                                setUnitPrice(text);
                                if (selectedProduct && !text) {
                                    setUnitPrice(selectedProduct.field_1makstnx35ralithjbb?.toString() || '');
                                }
                            }}
                            placeholder="0.00"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="decimal-pad"
                            style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('discount')}</Text>
                    <TextInput
                        value={discount}
                        onChangeText={setDiscount}
                        placeholder="0.00"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="decimal-pad"
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                    />
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
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>{t('cashier')}</Text>
                    <TextInput
                        value={cashier}
                        onChangeText={setCashier}
                        placeholder={t('cashier')}
                        placeholderTextColor={theme.textSecondary}
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
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

            <Modal visible={showCustomerModal} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: theme.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: theme.border }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>{t('selectCustomer')}</Text>
                            <TouchableOpacity onPress={() => setShowCustomerModal(false)}>
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {customers.map((customer) => (
                                <TouchableOpacity
                                    key={customer.id}
                                    onPress={() => {
                                        setSelectedCustomer(customer);
                                        setShowCustomerModal(false);
                                    }}
                                    style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.border }}
                                >
                                    <Text style={{ fontSize: 16, color: theme.text }}>{customer?.field_1ydd0pkoo6bdtko00fy}</Text>
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
                                        setUnitPrice(product?.field_1makstnx35ralithjbb?.toString() || '');
                                        setShowProductModal(false);
                                    }}
                                    style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.border }}
                                >
                                    <Text style={{ fontSize: 16, color: theme.text, marginBottom: 5 }}>{product?.field_06piwpi7gx57wgd67le}</Text>
                                    <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                                        {t('salePrice')}: {parseFloat(product?.field_1makstnx35ralithjbb || 0).toFixed(2)} ر.س
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default AddSaleScreen;