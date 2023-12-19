import { Link, useRouter } from "expo-router";
import { useCreateCustomer } from "medusa-react";
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

export default function SignUp() {
  const createCustomer = useCreateCustomer();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleCreate = async () => {
    try {
      await createCustomer.mutateAsync({
        first_name: formData.first_name,
        last_name: formData.last_name,
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
          Sign Up
        </Text>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-30}>
          <View className="flex flex-col justify-center items-center px-8 mb-4">
            <TextInput
              className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-2 text-base"
              placeholderTextColor={colors.gray[600]}
              placeholder="First name"
              textContentType="givenName"
              keyboardType="default"
              onChangeText={(text) => {
                setFormData({ ...formData, first_name: text });
              }}
              value={formData.first_name}
            />
            <TextInput
              className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-2 text-base"
              placeholderTextColor={colors.gray[600]}
              placeholder="Last Name"
              textContentType="familyName"
              keyboardType="default"
              onChangeText={(text) => {
                setFormData({ ...formData, last_name: text });
              }}
              value={formData.last_name}
            />
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
            </View>
            <Pressable
              className="rounded-md w-full h-12 flex justify-center items-center bg-slate-900 active:bg-slate-800 transition-all mb-4"
              hitSlop={{
                top: 0,
                left: 40,
                bottom: 0,
                right: 40,
              }}
              onPressOut={handleCreate}
            >
              <Text className="text-lg text-center text-white">Sign Up</Text>
            </Pressable>
            <Link href="/(auth)" className="w-full">
              <Text className="text-base underline text-center">Login</Text>
            </Link>
          </View>
        </KeyboardAvoidingView>
        <Text
          className="text-xs text-center w-full max-w-[300px] mx-auto mb-8 mt-auto"
          numberOfLines={3}
        >
          By signing up you agree with the{" "}
          <Text
            className="underline"
            onPress={() => {
              //Linking.openURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            }}
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            className="underline"
            onPress={() => {
              //Linking.openURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            }}
          >
            Privacy Policy.
          </Text>
        </Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
