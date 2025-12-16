
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
}

export default function FloatingTabBar({ tabs }: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === '/(tabs)/(home)/') {
      return pathname.startsWith('/(tabs)/(home)');
    }
    return pathname === route;
  };

  const getIconName = (icon: string, active: boolean) => {
    const iconMap: Record<string, { ios: string; android: string; iosFilled: string }> = {
      home: {
        ios: 'house',
        iosFilled: 'house.fill',
        android: 'home',
      },
      person: {
        ios: 'person',
        iosFilled: 'person.fill',
        android: 'person',
      },
    };

    const iconConfig = iconMap[icon] || iconMap.home;
    return {
      ios: active ? iconConfig.iosFilled : iconConfig.ios,
      android: iconConfig.android,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = isActive(tab.route);
          const iconNames = getIconName(tab.icon, active);
          
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => router.push(tab.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
                <IconSymbol
                  ios_icon_name={iconNames.ios}
                  android_material_icon_name={iconNames.android}
                  size={24}
                  color={active ? colors.primary : colors.textSecondary}
                />
              </View>
              <Text style={[styles.label, active && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: colors.highlight,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
