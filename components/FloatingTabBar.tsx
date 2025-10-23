
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 40,
  borderRadius = 25,
  bottomMargin = 34,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  
  const animatedValue = useSharedValue(0);

  const handleTabPress = (route: string) => {
    console.log('Tab pressed:', route);
    router.push(route as any);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(animatedValue.value, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  const getCurrentTabIndex = () => {
    const currentTab = tabs.findIndex(tab => {
      if (tab.name === '(home)') {
        return pathname.includes('/(home)/') || pathname === '/(tabs)';
      }
      return pathname.includes(`/${tab.name}`);
    });
    return currentTab >= 0 ? currentTab : 0;
  };

  const currentTabIndex = getCurrentTabIndex();

  return (
    <SafeAreaView style={[styles.safeArea, { bottom: bottomMargin }]} edges={['bottom']}>
      <Animated.View style={[animatedStyle]}>
        <BlurView
          intensity={80}
          tint={theme.dark ? 'dark' : 'light'}
          style={[
            styles.container,
            {
              width: containerWidth,
              borderRadius,
              backgroundColor: Platform.OS === 'android' 
                ? (theme.dark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)')
                : 'transparent',
            },
          ]}
        >
          {tabs.map((tab, index) => {
            const isActive = index === currentTabIndex;
            
            return (
              <TouchableOpacity
                key={tab.name}
                style={[
                  styles.tabButton,
                  isActive && styles.activeTabButton,
                  isActive && { backgroundColor: colors.primary }
                ]}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={tab.icon as any}
                  size={22}
                  color={isActive ? colors.card : colors.text}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? colors.card : colors.text,
                      fontWeight: isActive ? '600' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    minHeight: 50,
  },
  activeTabButton: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});
