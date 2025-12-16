
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { MessageTemplate } from '@/types/template';
import { loadTemplates, deleteTemplate } from '@/utils/templateStorage';
import { TemplateCard } from '@/components/TemplateCard';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const router = useRouter();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const loadedTemplates = await loadTemplates();
      setTemplates(loadedTemplates);
      console.log('Loaded templates:', loadedTemplates.length);
    } catch (error) {
      console.error('Error fetching templates:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách mẫu tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTemplates();
    }, [])
  );

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa mẫu "${templateName}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTemplate(templateId);
              await fetchTemplates();
              Alert.alert('Thành công', 'Đã xóa mẫu tin nhắn');
            } catch (error) {
              console.error('Error deleting template:', error);
              Alert.alert('Lỗi', 'Không thể xóa mẫu tin nhắn');
            }
          },
        },
      ]
    );
  };

  const handleTemplatePress = (template: MessageTemplate) => {
    router.push({
      pathname: '/(tabs)/(home)/generate',
      params: { templateId: template.id },
    });
  };

  const handleCreateTemplate = () => {
    router.push('/(tabs)/(home)/create');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mẫu Tin Nhắn</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleCreateTemplate}
          activeOpacity={0.7}
        >
          <IconSymbol 
            ios_icon_name="plus" 
            android_material_icon_name="add" 
            size={24} 
            color={colors.card} 
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : templates.length === 0 ? (
        <EmptyState 
          message="Chưa có mẫu tin nhắn nào. Nhấn nút + để tạo mẫu mới." 
          icon="doc.text"
        />
      ) : (
        <FlatList
          data={templates}
          renderItem={({ item }) => (
            <TemplateCard
              template={item}
              onPress={() => handleTemplatePress(item)}
              onDelete={() => handleDeleteTemplate(item.id, item.name)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.card,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
