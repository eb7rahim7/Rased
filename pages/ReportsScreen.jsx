import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text/Text';
import useTheme from '../contexts/useTheme/useTheme';
import useLang from '../contexts/useLang/useLang';
import useAppConfig from '../contexts/useAppConfig/useAppConfig';
import { useNavigation } from '@react-navigation/native';
import { toast } from '@backpackapp-io/react-native-toast';

const ReportsScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLang();
    const { isSandBox } = useAppConfig();

    const reports = [
        { id: 1, title: t('reportsCustomersDebt'), icon: 'people', color: '#F44336' },
        { id: 2, title: t('reportsDailySales'), icon: 'today', color: '#4CAF50' },
        { id: 3, title: t('reportsMonthlySales'), icon: 'calendar', color: '#2196F3' },
        { id: 4, title: t('reportsYearlySales'), icon: 'stats-chart', color: '#9C27B0' },
        { id: 5, title: t('reportsProfitLoss'), icon: 'trending-up', color: '#FF9800' },
        { id: 6, title: t('reportsInventory'), icon: 'cube', color: '#009688' },
        { id: 7, title: t('reportsSuppliers'), icon: 'briefcase', color: '#FF5722' },
        { id: 8, title: t('reportsExpenses'), icon: 'receipt', color: '#E91E63' },
        { id: 9, title: t('reportsEmployees'), icon: 'person', color: '#3F51B5' }
    ];

    const handleReportClick = (report) => {
        toast('تحت التطوير - سيتم إضافة التقارير التفصيلية قريباً');
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.primary }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' }}>{t('reports')}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {reports.map((report) => (
                    <TouchableOpacity
                        key={report.id}
                        onPress={() => handleReportClick(report)}
                        style={{ backgroundColor: theme.cardBg, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, flexDirection: 'row', alignItems: 'center' }}
                    >
                        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: report.color + '20', justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                            <Ionicons name={report.icon} size={24} color={report.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                                {report.title}
                            </Text>
                        </View>
                        <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                ))}

                <View style={{ height: isSandBox ? 40 : 120 }} />
            </ScrollView>
        </View>
    );
};

export default ReportsScreen;