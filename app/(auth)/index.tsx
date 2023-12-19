import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import colors from "tailwindcss/colors";
import AnimatedLogo from "../../components/AnimatedLogo";
import { medusaClient } from "../../config/medusa";

export default function Index() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await medusaClient.auth.authenticate({
        email: formData.email,
        password: formData.password,
      });

      router.replace("/(tabs)/(discover)/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex flex-col min-h-full justify-center">
        <Text className="text-2xl font-bold mt-2 mb-auto text-center">
          Login
        </Text>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={0}
          className="flex flex-col justify-center items-center px-8 mb-auto"
        >
          <AnimatedLogo />
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
          <View className="flex flex-col justify-center items-stretch w-full mb-3">
            <TextInput
              className="border-2 border-gray-300 rounded-md p-2 pt-0 mb-2 h-12 text-base"
              placeholderTextColor={colors.gray[600]}
              placeholder="Password"
              textContentType="password"
              keyboardType="visible-password"
              secureTextEntry={true}
              onChangeText={(text) => {
                setFormData({ ...formData, password: text });
              }}
              value={formData.password}
            />
            <Link href="/(auth)/password-reset">
              <Text className="text-base underline text-right">
                Forgot your password?
              </Text>
            </Link>
          </View>
          <Pressable
            className="rounded-md w-full h-12 flex justify-center items-center bg-slate-900 active:bg-slate-800 transition-all mb-4"
            hitSlop={{
              top: 0,
              left: 40,
              bottom: 0,
              right: 40,
            }}
            onPressOut={handleLogin}
          >
            <Text className="text-lg text-center text-white">Login</Text>
          </Pressable>
          <Link href="/(auth)/sign-up" className="w-full">
            <Text className="text-base underline text-center">Sign up</Text>
          </Link>
          <View className="h-10" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
