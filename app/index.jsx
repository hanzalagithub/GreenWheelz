import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView backgroundColor='#FFFFFF'>
      <Loader isLoading={loading} />

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center h-full items-center px-4">
          <Image
            source={images.greenlogo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          <Image
            source={images.greenwheelz}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-green-500 font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-green-900">GreenWheelZ</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[150px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-green-900 mt-7 text-center">
            Embark on a Journey of Limitless
            Exploration with GreenWheelZ
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-6"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="black" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
