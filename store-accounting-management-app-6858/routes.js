
                    import LoginScreen from './pages/LoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import SuppliersScreen from './pages/SuppliersScreen';
import AddSupplierScreen from './pages/AddSupplierScreen';
import SupplierDetailsScreen from './pages/SupplierDetailsScreen';
import ProductsScreen from './pages/ProductsScreen';
import AddProductScreen from './pages/AddProductScreen';
import SalesScreen from './pages/SalesScreen';
import AddSaleScreen from './pages/AddSaleScreen';
import CustomersScreen from './pages/CustomersScreen';
import AddCustomerScreen from './pages/AddCustomerScreen';
import ExpensesScreen from './pages/ExpensesScreen';
import AddExpenseScreen from './pages/AddExpenseScreen';
import ReportsScreen from './pages/ReportsScreen';
import SettingsScreen from './pages/SettingsScreen';
import EmployeesScreen from './pages/EmployeesScreen';
import AddEmployeeScreen from './pages/AddEmployeeScreen';
import PurchasesScreen from './pages/PurchasesScreen';
import AddPurchaseScreen from './pages/AddPurchaseScreen';
import ProductDetailsScreen from './pages/ProductDetailsScreen';

                    export const mainRoutes = [
                    {
                            routeName: "Login",
                            component: LoginScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "Dashboard",
                            component: DashboardScreen,
                            position: "RIGHT",
                            is_main: true,
                            icon: "home",
                            show_bot_bar: true,
                            user_permission: false
                        },
{
                            routeName: "Suppliers",
                            component: SuppliersScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "AddSupplier",
                            component: AddSupplierScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "SupplierDetails",
                            component: SupplierDetailsScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "Products",
                            component: ProductsScreen,
                            position: "LEFT",
                            is_main: false,
                            icon: "cube",
                            show_bot_bar: true,
                            user_permission: true
                        },
{
                            routeName: "AddProduct",
                            component: AddProductScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "Sales",
                            component: SalesScreen,
                            position: "RIGHT",
                            is_main: false,
                            icon: "cart",
                            show_bot_bar: true,
                            user_permission: true
                        },
{
                            routeName: "AddSale",
                            component: AddSaleScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "Customers",
                            component: CustomersScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "AddCustomer",
                            component: AddCustomerScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "Expenses",
                            component: ExpensesScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "AddExpense",
                            component: AddExpenseScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "Reports",
                            component: ReportsScreen,
                            position: "LEFT",
                            is_main: false,
                            icon: "stats-chart",
                            show_bot_bar: true,
                            user_permission: true
                        },
{
                            routeName: "Settings",
                            component: SettingsScreen,
                            position: "RIGHT",
                            is_main: false,
                            icon: "settings",
                            show_bot_bar: true,
                            user_permission: true
                        },
{
                            routeName: "Employees",
                            component: EmployeesScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "AddEmployee",
                            component: AddEmployeeScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "Purchases",
                            component: PurchasesScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "AddPurchase",
                            component: AddPurchaseScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        },
{
                            routeName: "ProductDetails",
                            component: ProductDetailsScreen,
                            position: "NONE",
                            is_main: false,
                            icon: "",
                            show_bot_bar: false,
                            user_permission: false
                        }
                    ];
                