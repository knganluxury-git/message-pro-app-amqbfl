
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const handleClearAllData = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa tất cả',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Thành công', 'Đã xóa tất cả dữ liệu');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Lỗi', 'Không thể xóa dữ liệu');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cá Nhân</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <IconSymbol 
              ios_icon_name="person.circle.fill" 
              android_material_icon_name="account_circle" 
              size={80} 
              color={colors.primary} 
            />
          </View>
          <Text style={styles.profileName}>Người dùng</Text>
          <Text style={styles.profileSubtitle}>Quản lý mẫu tin nhắn</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
          
          <View style={styles.infoCard}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Về ứng dụng</Text>
              <Text style={styles.infoText}>
                Ứng dụng quản lý và sử dụng mẫu tin nhắn cho khách hàng. 
                Giúp bạn gửi tin nhắn nhanh chóng, đồng nhất và chuyên nghiệp.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <IconSymbol 
              ios_icon_name="doc.text.fill" 
              android_material_icon_name="description" 
              size={24} 
              color={colors.accent} 
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Cách sử dụng</Text>
              <Text style={styles.infoText}>
                1. Tạo mẫu tin nhắn với các trường tùy chỉnh{'\n'}
                2. Chọn mẫu và điền thông tin{'\n'}
                3. Sao chép và dán vào Zalo hoặc ứng dụng khác
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          
          <TouchableOpacity 
            style={styles.dangerButton} 
            onPress={handleClearAllData}
            activeOpacity={0.7}
          >
            <IconSymbol 
              ios_icon_name="trash.fill" 
              android_material_icon_name="delete" 
              size={20} 
              color={colors.card} 
            />
            <Text style={styles.dangerButtonText}>Xóa tất cả dữ liệu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Phiên bản 1.0.0</Text>
          <Text style={styles.footerText}>© 2025 Message Templates</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 16,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.card,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  profileCard: {
    backgroundColor: colors.card,
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  dangerButton: {
    flexDirection: 'row',
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(244, 67, 54, 0.3)',
    elevation: 3,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
