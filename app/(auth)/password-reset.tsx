import { Link } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import { medusaClient } from "../../config/medusa";

export default function PasswordReset() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleResetPassword = async () => {
    try {
      await medusaClient.customers.generatePasswordToken({
        email: formData.email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex flex-col min-h-full justify-center">
        <Text className="text-2xl font-bold mt-2 mb-auto text-center">
          Password Reset
        </Text>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={0}
          className="flex flex-col justify-center items-center px-8 mb-auto"
        >
          <TextInput
            className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-2 text-base"
            placeholderTextColor={colors.gray[600]}
            placeholder="Email"
            textContentType="emailAddress"
            keyboardType="email-address"
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
            }}
            value={formData.email}
          />
          <Pressable
            className="rounded-md w-full h-12 flex justify-center items-center bg-slate-900 active:bg-slate-800 transition-all mb-4"
            hitSlop={{
              top: 0,
              left: 40,
              bottom: 0,
              right: 40,
            }}
            onPressOut={handleResetPassword}
          >
            <Text className="text-lg text-center text-white">Reset</Text>
          </Pressable>
          <Link href="/(auth)" className="w-full">
            <Text className="text-base underline text-center">Login</Text>
          </Link>
          <View className="h-10" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
