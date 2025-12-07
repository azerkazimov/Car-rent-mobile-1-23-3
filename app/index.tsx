import Launch from "@/components/screens/launch/launch";
import Home from "@/components/screens/main/home";
import { useLaunchStore } from "@/store/use-launch.store";
import SignIn from "./sign-in/page";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function Index() {
  const { index } = useLaunchStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const getIsAuthenticated = async () =>
    setIsAuthenticated(await AsyncStorage.getItem("isAuthenticated") === "true");

  useEffect(() => {
    getIsAuthenticated();
  }, []);

  return (
    <>
      {index === 0 && <Launch />}
      {isAuthenticated && index === 1 && <Home />}
      {!isAuthenticated && index === 1 && <SignIn />}
    </>
  );
}
