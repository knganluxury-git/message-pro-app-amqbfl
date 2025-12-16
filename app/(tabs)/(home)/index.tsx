
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Platform } from 'react-native';
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
  const [filteredTemplates, setFilteredTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const loadedTemplates = await loadTemplates();
      setTemplates(loadedTemplates);
      setFilteredTemplates(loadedTemplates);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredTemplates(templates);
    } else {
      const filtered = templates.filter(template =>
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTemplates(filtered);
    }
  };

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

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredTemplates(templates);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
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
        
        {templates.length > 0 && (
          <View style={styles.searchContainer}>
            <IconSymbol 
              ios_icon_name="magnifyingglass" 
              android_material_icon_name="search" 
              size={20} 
              color={colors.textSecondary} 
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm mẫu tin..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <IconSymbol 
                  ios_icon_name="xmark.circle.fill" 
                  android_material_icon_name="cancel" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : filteredTemplates.length === 0 ? (
        <EmptyState 
          message={searchQuery ? "Không tìm thấy mẫu tin nào" : "Chưa có mẫu tin nhắn nào. Nhấn nút + để tạo mẫu mới."} 
          icon="doc.text"
        />
      ) : (
        <View style={styles.listWrapper}>
          <FlatList
            data={filteredTemplates}
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
          <View style={styles.statsBar}>
            <Text style={styles.statsText}>
              {filteredTemplates.length} mẫu tin {searchQuery ? '(đã lọc)' : ''}
            </Text>
          </View>
        </View>
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
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  listWrapper: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140,
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
  statsBar: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
