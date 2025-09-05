import React from "react";
import { View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

type WeatherIconProps = {
  weather: string;
  size: number;
};

export function WeatherIcon({ weather, size }: WeatherIconProps) {
        switch (weather) {
            case "sunny":
                return (
                    <View>
                        <MaterialIcons name="sunny" size={size} color="black" />
                    </View>
                )
            case "rainy":
                return (
                    <View>
                        <Ionicons name="rainy-outline" size={size} color="black" />
                    </View>
                )
            case "thundering":
                return (
                    <View>
                        <Entypo name="thunder-cloud" size={size} color="black" />
                    </View>
                )
            case "cloudy":
                return (
                    <View>
                        <Fontisto name="cloudy" size={size} color="black" />
                    </View>
                )
            case "frosty":
                return (
                    <View>
                        <FontAwesome5 name="snowflake" size={size} color="black" />
                    </View>
                )
            default:
                return (
                    <View>
                        <AntDesign name="questioncircleo" size={size} color="black" />
                    </View>
                )
            }
    }