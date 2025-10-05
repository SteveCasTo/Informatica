import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Animated, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MateriasScreen } from '../screens/Subjects/SubjectsScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { AdminScreen } from '../screens/Admin/AdminScreen';
import { styles, tabHeight } from './BottomTabs.styles';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

export const BottomTabs = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  // Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -3, duration: 1000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 3, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Materias"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          height: tabHeight,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <View style={styles.tabBarWrapper}>
            <Svg width={width} height={tabHeight}>
              <Path
                d={`
                  M0,0 
                  H${width / 2 - 40} 
                  C${width / 2 - 20},0 ${width / 2 - 20},40 ${width / 2},40 
                  C${width / 2 + 20},40 ${width / 2 + 20},0 ${width / 2 + 40},0 
                  H${width} 
                  V${tabHeight} 
                  H0 
                  Z
                `}
                fill="#fff"
                stroke="#ccc"
                strokeWidth={0.5}
              />
            </Svg>
          </View>
        ),
      }}
    >
      {/* Perfil */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <MaterialCommunityIcons
                name={focused ? "account-circle" : "account-circle-outline"}
                color={focused ? "#6750A4" : "#79747E"}
                size={26}
              />
            </View>
          ),
        }}
      />
      {/* Materias */}
      <Tab.Screen
        name="Materias"
        component={MateriasScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Animated.View
              style={[
                styles.mainButtonContainer,
                focused ? styles.mainButtonFocused : styles.mainButtonInactive,
                { transform: [{ translateY: floatAnim }] },
              ]}
            >
              <MaterialCommunityIcons
                name="book-open-variant"
                color={focused ? "#fff" : "#79747E"}
                size={28}
              />
            </Animated.View>
          ),
        }}
      />

      {/* Admin */}
      <Tab.Screen
        name="Administración"
        component={AdminScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <MaterialCommunityIcons
                name={focused ? "cog" : "cog-outline"}
                color={focused ? "#6750A4" : "#79747E"}
                size={26}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};