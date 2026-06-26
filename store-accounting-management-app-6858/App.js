import { ThemeProvider } from "./contexts/useTheme/useTheme";
import { LangProvider } from "./contexts/useLang/useLang";
import { UserProvider } from "./contexts/useUser/useUser";
import RoutingHandler from "./RoutingHandler";
import { useFonts } from "expo-font";
import { AppConfigProvider } from "./contexts/useAppConfig/useAppConfig";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { toast, Toasts } from "@backpackapp-io/react-native-toast";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [fontsLoaded] = useFonts({
    "JF-Flat-light": require("./fonts/ar/JF-Flat-light.ttf"),
    "JF-Flat-medium": require("./fonts/ar/JF-Flat-medium.ttf"),
    "JF-Flat-bold": require("./fonts/ar/JF-Flat-regular.ttf"),
  });

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <AppConfigProvider>
          <LangProvider>
            <ThemeProvider>
              <UserProvider>
                <RoutingHandler />
                <Toasts />
              </UserProvider>
            </ThemeProvider>
          </LangProvider>
        </AppConfigProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
