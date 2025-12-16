
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MessageTemplate } from '@/types/template';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface TemplateCardProps {
  template: MessageTemplate;
  onPress: () => void;
  onDelete: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onPress, onDelete }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <IconSymbol 
            ios_icon_name="doc.text.fill" 
            android_material_icon_name="description" 
            size={24} 
            color={colors.primary} 
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{template.name}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={2}>
            {template.content.substring(0, 80)}...
          </Text>
          <Text style={styles.cardMeta}>
            {template.fields.length} trường • {new Date(template.updatedAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol 
            ios_icon_name="trash.fill" 
            android_material_icon_name="delete" 
            size={20} 
            color={colors.error} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  cardMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
});
