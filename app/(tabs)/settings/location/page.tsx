import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { useEffect, useState } from "react";

import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function LocationPage() {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
    getCurrentLocation();
  }, []);

  if (errorMsg) {
    return (
      <View>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={layoutTheme.colors.primary[500]}
        />
        <Text>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="You are here"
        />
      </MapView>
    </View>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    map: {
      width: "100%",
      height: "100%",
    },
  });
