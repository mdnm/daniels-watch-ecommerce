import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
import { medusaClient } from "../../config/medusa";
import { useCustomer } from "../../contexts/CustomerContext";

export default function UserUpdate() {
  const { customer } = useCustomer();
  const [formData, setFormData] = useState({
    first_name: customer?.first_name,
    last_name: customer?.last_name,
    email: customer?.email,
    password: "",
  });

  const handleUpdateEmail = async () => {
    try {
      const password = formData.password ? { password: formData.password } : {};

      await medusaClient.customers.update({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        ...password,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex flex-col min-h-full justify-center">
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={0}
          className="flex flex-col justify-center items-center px-8"
        >
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
            onPressOut={handleUpdateEmail}
          >
            <Text className="text-lg text-center text-white">Update</Text>
          </Pressable>
          <Link href="/(tabs)/profile" className="w-full">
            <Text className="text-base underline text-center">Dismiss</Text>
          </Link>
          <View className="h-12" />
        </KeyboardAvoidingView>
        <StatusBar style="light" animated />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
