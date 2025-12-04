import Launch from "@/components/screens/launch/launch";
import Home from "@/components/screens/main/home";
import { useLaunchStore } from "@/store/use-launch.store";
import SignIn from "./sign-in/page";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAuthStore } from "@/store/auth.store";

export default function Index() {
  const router = useRouter();
  const { index } = useLaunchStore();

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isAuthenticated = await AsyncStorage.getItem("isAuthenticated")
        if (isAuthenticated === "true") {
          router.replace("/(tabs)");
        } else {
          router.replace("/sign-in/page");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to check authentication");
        console.log(error);
      }
    }
    checkAuthentication();
  }, []);

  return (
    <>
      {index === 0 && <Launch />}
      {isAuthenticated && index === 1 && <Home />}
      {!isAuthenticated && index === 1 && <SignIn />}
    </>
  );
}
