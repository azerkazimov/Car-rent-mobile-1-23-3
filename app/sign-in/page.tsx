import { SafeAreaView } from "react-native-safe-area-context";
import SignInForm from "./components/sign-in-form";

export default function SignIn() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SignInForm />
    </SafeAreaView>
  );
}