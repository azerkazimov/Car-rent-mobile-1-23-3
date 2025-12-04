import DriverLicenseForm from "@/components/screens/driver-license/driver-license-form";

import { SafeAreaView } from "react-native-safe-area-context";

export default function DriverLicensePage() {
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <DriverLicenseForm />
    </SafeAreaView>
  );
}
