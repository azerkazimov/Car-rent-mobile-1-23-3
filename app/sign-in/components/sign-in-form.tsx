import Button from "@/components/ui/button";
import SosialButton from "@/components/ui/sosial-button";
import { layoutTheme } from "@/constant/theme";
import { useAuthStore } from "@/store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Label } from "@react-navigation/elements";
import { Link, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SignInSchema, signInSchema } from "./sign-in.schema";

export default function SignInForm() {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInSchema) => {
    try {
      const user = await AsyncStorage.getItem("user");

      if (!user) {
        Alert.alert("Error", "No user found. Please sign up first.");
        return;
      }

      const userData = JSON.parse(user);

      if (
        userData.email === data.email &&
        userData.password === data.password
      ) {
        setUser(userData);
        await AsyncStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        console.log("User logged in", userData);
        router.replace("/");
      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      Alert.alert(
        "Error",
        "An error occurred during sign in. Please try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <Text style={styles.title}>Sign In</Text>
                  <View style={styles.underline} />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Label style={styles.label}>EMAIL OR PHONE</Label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                      {errors.email && (
                        <Text style={styles.error}>{errors.email.message}</Text>
                      )}
                    </>
                  )}
                />
              </View>
              <View style={styles.formGroup}>
                <Label style={styles.label}>PASSWORD</Label>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                      />
                      {errors.password && (
                        <Text style={styles.error}>
                          {errors.password?.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* BUTTONS */}
              <View style={styles.buttonsContainer}>
                <Button title="Sign In" onPress={handleSubmit(onSubmit)} />

                <Text style={styles.orText}>OR</Text>
                <SosialButton
                  icon={require("../../../assets/images/icons/google-icon.png")}
                  title="Sign Up with Google"
                  onPress={() => {}}
                />
                <SosialButton
                  icon={require("../../../assets/images/icons/facebook-icon.png")}
                  title="Sign Up with Google"
                  onPress={() => {}}
                />
              </View>

              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>
                  {`If you don't have an account?`}{" "}
                </Text>
                <Link href="/sign-up/page" style={styles.link}>
                  Sign Up
                </Link>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  header: {
    padding: 20,
    marginBottom: 28,
  },
  headerContent: {
    position: "relative",
    paddingVertical: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: layoutTheme.fonts.imprima.regular,
  },
  underline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 58,
    height: 4,
    backgroundColor: layoutTheme.colors.secondary[500],
    borderRadius: 5,
  },
  formGroup: {
    paddingHorizontal: 20,
  },
  label: {
    textAlign: "left",
    fontSize: 16,
    fontFamily: layoutTheme.fonts.roboto.regular,
    color: layoutTheme.colors.secondary[500],
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "gray",
    paddingVertical: 5,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  buttonsContainer: {
    marginVertical: 24,
    gap: 10,
  },
  orText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: layoutTheme.fonts.roboto.regular,
    color: layoutTheme.colors.secondary[500],
    marginVertical: 10,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
  linkText: {
    fontFamily: layoutTheme.fonts.roboto.regular,
  },
  link: {
    fontFamily: layoutTheme.fonts.roboto.regular,
    color: layoutTheme.colors.text.link,
    fontSize: 16,
  },
});
