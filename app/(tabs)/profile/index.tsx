import { Heading, VStack } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView>
      <VStack p={"$3"}>
        <Heading>Your name</Heading>
      </VStack>
    </SafeAreaView>
  );
}
