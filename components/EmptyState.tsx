
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  icon = 'doc.text' 
}) => {
  return (
    <View style={styles.container}>
      <IconSymbol 
        ios_icon_name={icon} 
        android_material_icon_name="description" 
        size={64} 
        color={colors.textSecondary} 
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
});
