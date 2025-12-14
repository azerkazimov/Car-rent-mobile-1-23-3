import { iceberg } from "@/constant/iceberg";
import { imprima } from "@/constant/imprima";
import { kaushanScript } from "@/constant/kaushan_script";
import { ptSans } from "@/constant/pt_sans";
import { questrial } from "@/constant/questrial";
import { roboto } from "@/constant/roboto";
import useLayoutFonts from "@/hooks/use-font";
import { useTheme } from "@/hooks/use-theme";
import { removeNotificationListeners, setupNotificationListeners } from "@/notifications/listeners";
import {
    configureNotificationsHandler,
    registerForPushNotifications,
} from "@/notifications/register";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar, Text } from "react-native";

export default function LayoutContent() {
  const fonts = {
    ...roboto,
    ...ptSans,
    ...kaushanScript,
    ...imprima,
    ...questrial,
    ...iceberg,
  };

  const { colorScheme } = useTheme();
  const { loaded, error } = useLayoutFonts(fonts);

  useEffect(() => {
    configureNotificationsHandler();
    setupNotificationListeners();
    registerForPushNotifications().then((token) => {
      if (token) {
        console.log("Push token registered successfully:", token);
      }
    });

    return () => {
      removeNotificationListeners();
    };
  }, []);

  if (!loaded && !error) {
    return null;
  }

  if (error) {
    return <Text>Error loading fonts</Text>;
  }

  return (
    <>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up/page" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in/page" options={{ headerShown: false }} />
        <Stack.Screen
          name="cars/[id]/page"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen name="checkout/page" options={{ headerShown: false }} />
        <Stack.Screen name="payment/page" options={{ headerShown: false }} />
        <Stack.Screen
          name="credit-card/page"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="confirm-payment/page"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="payment-made/page"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
