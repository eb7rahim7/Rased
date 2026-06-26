import { View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import { useState } from 'react';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { post } from '../api/post';
import { toast } from '@backpackapp-io/react-native-toast';

const AddProductScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();
    const [productName, setProductName] = useState('');
    const [barcode, setBarcode] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState('');
    const [minStockAlert, setMinStockAlert] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!productName || !purchasePrice || !salePrice) {
            toast.error(t('required'));
            return;
        }

        setLoading(true);
        const sendData = {
            field_06piwpi7gx57wgd67le: productName,
            field_sjl0ajl004k62x3qd9z: barcode,
            field_nbc6erfj5n870216a6q: parseFloat(purchasePrice) || 0,
            field_1makstnx35ralithjbb: parseFloat(salePrice) || 0,
            field_t697t6uo4i1xbat2g66: parseFloat(currentQuantity) || 0,
            field_n21zo108wc1ib1fdifd: parseFloat(minStockAlert) || 0,
            field_s2svc7rg47taxeaexnm: category
        };

        const res = await post({ 
            path: 'application/6858/item_data?model=5&ignore_container=1&by_field_code=1&by_field_name=1&result_structure_short=1',
            sendData 
        });

        setLoading(false);

        if (res?.data?.data?.item_id) {
            toast.success(t('success'));
            navigation.goBack();
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.background }}
        >
            <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', flex: 1, textAlign: 'center', marginLeft: -39 }}>{t('addProduct')}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('productName')} *
                    </Text>
                    <TextInput
                        value={productName}
                        onChangeText={setProductName}
                        placeholder={t('productName')}
                        placeholderTextColor={theme.textSecondary}
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('barcode')}
                    </Text>
                    <TextInput
                        value={barcode}
                        onChangeText={setBarcode}
                        placeholder={t('barcode')}
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="numeric"
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                        {t('category')}
                    </Text>
                    <TextInput
                        value={category}
                        onChangeText={setCategory}
                        placeholder={t('category')}
                        placeholderTextColor={theme.textSecondary}
                        style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                    />
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <View style={{ flex: 1, marginLeft: 7.5 }}>
                        <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                            {t('purchasePrice')} *
                        </Text>
                        <TextInput
                            value={purchasePrice}
                            onChangeText={setPurchasePrice}
                            placeholder="0.00"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="decimal-pad"
                            style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                        />
                    </View>
                    <View style={{ flex: 1, marginRight: 7.5 }}>
                        <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                            {t('salePrice')} *
                        </Text>
                        <TextInput
                            value={salePrice}
                            onChangeText={setSalePrice}
                            placeholder="0.00"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="decimal-pad"
                            style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <View style={{ flex: 1, marginLeft: 7.5 }}>
                        <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                            {t('currentQuantity')}
                        </Text>
                        <TextInput
                            value={currentQuantity}
                            onChangeText={setCurrentQuantity}
                            placeholder="0"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="numeric"
                            style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                        />
                    </View>
                    <View style={{ flex: 1, marginRight: 7.5 }}>
                        <Text style={{ fontSize: 14, color: theme.text, marginBottom: 8, fontWeight: '600' }}>
                            {t('minStockAlert')}
                        </Text>
                        <TextInput
                            value={minStockAlert}
                            onChangeText={setMinStockAlert}
                            placeholder="0"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="numeric"
                            style={{ backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 15, paddingVertical: 15, color: theme.text, fontSize: 16 }}
                        />
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
        </KeyboardAvoidingView>
    );
};

export default AddProductScreen;