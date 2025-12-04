import Button from "@/components/ui/button";
import { layoutTheme } from "@/constant/theme";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
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
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import {
    driverLicenseSchema,
    DriverLicenseSchema,
} from "./driver-license.schema";

// Format date input as MM/DD/YYYY
const formatDate = (text: string): string => {
  // Remove all non-numeric characters
  const cleaned = text.replace(/\D/g, "");

  // Apply formatting
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 4) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  } else {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(
      4,
      8
    )}`;
  }
};

export default function DriverLicenseForm() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DriverLicenseSchema>({
    resolver: zodResolver(driverLicenseSchema),
  });

  const onSubmit = (data: DriverLicenseSchema) => {
    console.log(data);
  };

  const [licenseImage, setLicenseImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permitionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permitionResult.granted === false) {
      Alert.alert(
        "Permission denied",
        "Please grant permission to access your media library"
      );
      return;
    }

    Alert.alert(
      "Upload License Photo",
      "Choose an option",
      [
        {
          text: "Take a photo",
          onPress: async () => {
            const cameraPermition =
              await ImagePicker.requestCameraPermissionsAsync();
            if (cameraPermition.granted) {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });
              if (!result.canceled) {
                setLicenseImage(result.assets[0].uri);
                setValue("driverLicenseImage", result.assets[0].uri);
              }
            }
          },
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
            if (!result.canceled) {
              setLicenseImage(result.assets[0].uri);
              setValue("driverLicenseImage", result.assets[0].uri);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
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
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Driving Licence</Text>

              {/* Licence Number Input */}
              <Controller
                control={control}
                name="driverLicenseNumber"
                render={({ field: { value, onChange, onBlur } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Licence Number"
                      placeholderTextColor="#D1D1D1"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="numeric"
                    />
                    {errors.driverLicenseNumber && (
                      <Text style={styles.errorText}>
                        {errors.driverLicenseNumber.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Expiry Date Input */}
              <Controller
                control={control}
                name="driverLicenseExpirationDate"
                render={({ field: { value, onChange, onBlur } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Expiry Date (MM/DD/YYYY)"
                      placeholderTextColor="#D1D1D1"
                      value={value}
                      onChangeText={(text) => onChange(formatDate(text))}
                      onBlur={onBlur}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                    {errors.driverLicenseExpirationDate && (
                      <Text style={styles.errorText}>
                        {errors.driverLicenseExpirationDate.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.uploadTitle}>Upload Driver License</Text>

              <TouchableOpacity
                style={styles.uploadArea}
                activeOpacity={0.7}
                onPress={pickImage}
              >
                {licenseImage ? (
                  <Image
                    source={{ uri: licenseImage }}
                    style={styles.uploadImage}
                  />
                ) : (
                  <View style={styles.uploadImageContainer}>
                    <View style={styles.iconWrapper}>
                      <Ionicons
                        name="cloud-upload-outline"
                        size={40}
                        color="#7C7C7C"
                      />
                    </View>
                    <Text style={styles.uploadText}>Tap to upload image</Text>
                    <Text style={styles.uploadSubText}>
                      JPG, PNG up to 10MB
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
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
    gap: 10,
  },
  formSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  inputWrapper: {
    gap: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
  uploadSection: {
    marginTop: 32,
    gap: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: "#D1D1D1",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: layoutTheme.colors.background.gray,
    minHeight: 180,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  uploadImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  uploadImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EBEBEB",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  uploadSubText: {
    fontSize: 13,
    color: "#9E9E9E",
  },
});
