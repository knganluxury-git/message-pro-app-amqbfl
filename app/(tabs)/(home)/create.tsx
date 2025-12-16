
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MessageTemplate } from '@/types/template';
import { loadTemplates, saveTemplates } from '@/utils/templateStorage';
import { parseTemplateFields } from '@/utils/templateParser';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function CreateTemplateScreen() {
  const router = useRouter();
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên mẫu tin nhắn');
      return;
    }

    if (!templateContent.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung mẫu tin nhắn');
      return;
    }

    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      const fields = parseTemplateFields(templateContent);
      
      const newTemplate: MessageTemplate = {
        id: `template_${Date.now()}`,
        name: templateName.trim(),
        content: templateContent.trim(),
        fields,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const existingTemplates = await loadTemplates();
      await saveTemplates([...existingTemplates, newTemplate]);

      Alert.alert(
        'Thành công', 
        'Đã lưu mẫu tin nhắn thành công!',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)/(home)');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving template:', error);
      Alert.alert('Lỗi', 'Không thể lưu mẫu tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (templateName.trim() || templateContent.trim()) {
      Alert.alert(
        'Xác nhận',
        'Bạn có muốn hủy? Các thay đổi sẽ không được lưu.',
        [
          { text: 'Tiếp tục chỉnh sửa', style: 'cancel' },
          {
            text: 'Hủy',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleCancel}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow_back" 
            size={24} 
            color={colors.card} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo Mẫu Mới</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={20} 
            color={colors.primary} 
          />
          <Text style={styles.infoText}>
            Sử dụng {'{tên_trường}'} để tạo các trường có thể tùy chỉnh.{'\n'}
            Ví dụ: {'{tên khách hàng}'}, {'{sản phẩm}'}, {'{số tiền}'}
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tên mẫu tin nhắn *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: Xác nhận đơn hàng"
            placeholderTextColor={colors.textSecondary}
            value={templateName}
            onChangeText={setTemplateName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nội dung mẫu *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Nhập nội dung mẫu tin nhắn...&#10;&#10;Ví dụ:&#10;Xin chào {tên khách hàng},&#10;&#10;Cảm ơn bạn đã đặt hàng {sản phẩm}.&#10;Tổng tiền: {số tiền}&#10;&#10;Trân trọng!"
            placeholderTextColor={colors.textSecondary}
            value={templateContent}
            onChangeText={setTemplateContent}
            multiline
            numberOfLines={12}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
          onPress={handleSaveTemplate}
          activeOpacity={0.8}
          disabled={isSaving}
        >
          <IconSymbol 
            ios_icon_name="checkmark.circle.fill" 
            android_material_icon_name="check_circle" 
            size={20} 
            color={colors.card} 
          />
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Đang lưu...' : 'Lưu Mẫu'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 16,
    backgroundColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 200,
    maxHeight: 400,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(33, 150, 243, 0.3)',
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  bottomSpacer: {
    height: 100,
  },
});
