import { useEffect } from "react";
import { Animated, Keyboard, KeyboardEvent } from "react-native";

const IMAGE_HEIGHT_SMALL = 80;
const IMAGE_HEIGHT = 144;

const IMAGE_WIDTH_SMALL = 160;
const IMAGE_WIDTH = 280;

export default function AnimatedLogo() {
  const imageHeight = new Animated.Value(IMAGE_HEIGHT);
  const imageWidth = new Animated.Value(IMAGE_WIDTH);

  const keyboardWillShow = (event: KeyboardEvent) => {
    Animated.timing(imageWidth, {
      duration: event.duration,
      toValue: IMAGE_WIDTH_SMALL,
      useNativeDriver: false,
    }).start();
    Animated.timing(imageHeight, {
      duration: event.duration,
      toValue: IMAGE_HEIGHT_SMALL,
      useNativeDriver: false,
    }).start();
  };

  const keyboardWillHide = (event: KeyboardEvent) => {
    Animated.timing(imageHeight, {
      duration: event.duration,
      toValue: IMAGE_HEIGHT,
      useNativeDriver: false,
    }).start();
    Animated.timing(imageWidth, {
      duration: event.duration,
      toValue: IMAGE_WIDTH,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const keyboardWillShowSubscription = Keyboard.addListener(
      "keyboardWillShow",
      keyboardWillShow
    );
    const keyboardWillHideSubscription = Keyboard.addListener(
      "keyboardWillHide",
      keyboardWillHide
    );

    return () => {
      keyboardWillShowSubscription.remove();
      keyboardWillHideSubscription.remove();
    };
  }, []);

  return (
    <Animated.Image
      source={require("../assets/images/logo.png")}
      className="mb-6"
      style={{
        height: imageHeight,
        width: imageWidth,
      }}
    />
  );
}
