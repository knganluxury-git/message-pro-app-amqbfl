
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon ios="house.fill" />
        <Label>Trang chủ</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon ios="person.fill" />
        <Label>Cá nhân</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
