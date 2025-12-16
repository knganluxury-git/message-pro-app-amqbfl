
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
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hôm nay';
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

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
            {template.content.length > 80 
              ? `${template.content.substring(0, 80)}...` 
              : template.content}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.metaItem}>
              <IconSymbol 
                ios_icon_name="square.grid.3x3.fill" 
                android_material_icon_name="grid_on" 
                size={14} 
                color={colors.textSecondary} 
              />
              <Text style={styles.cardMeta}>{template.fields.length} trường</Text>
            </View>
            <View style={styles.metaItem}>
              <IconSymbol 
                ios_icon_name="clock.fill" 
                android_material_icon_name="schedule" 
                size={14} 
                color={colors.textSecondary} 
              />
              <Text style={styles.cardMeta}>{formatDate(template.updatedAt)}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
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
    marginBottom: 8,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});
