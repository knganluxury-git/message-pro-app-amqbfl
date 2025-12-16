
import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { MessageTemplate, TemplateField } from '@/types/template';
import { loadTemplates } from '@/utils/templateStorage';
import { generateMessage } from '@/utils/templateParser';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function GenerateMessageScreen() {
  const router = useRouter();
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const [template, setTemplate] = useState<MessageTemplate | null>(null);
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [generatedMessage, setGeneratedMessage] = useState('');

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  useEffect(() => {
    if (template) {
      const message = generateMessage(template.content, fields);
      setGeneratedMessage(message);
    }
  }, [fields, template]);

  const loadTemplate = async () => {
    try {
      const templates = await loadTemplates();
      const foundTemplate = templates.find(t => t.id === templateId);
      
      if (foundTemplate) {
        setTemplate(foundTemplate);
        setFields(foundTemplate.fields.map(f => ({ ...f, value: '' })));
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy mẫu tin nhắn', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error('Error loading template:', error);
      Alert.alert('Lỗi', 'Không thể tải mẫu tin nhắn');
    }
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFields(prevFields =>
      prevFields.map(field =>
        field.id === fieldId ? { ...field, value } : field
      )
    );
  };

  const handleCopyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(generatedMessage);
      Alert.alert('Thành công', 'Đã sao chép tin nhắn vào clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Lỗi', 'Không thể sao chép tin nhắn');
    }
  };

  const handleClearFields = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có muốn xóa tất cả các trường đã nhập?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setFields(prevFields =>
              prevFields.map(field => ({ ...field, value: '' }))
            );
          },
        },
      ]
    );
  };

  if (!template) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow_back" 
            size={24} 
            color={colors.card} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{template.name}</Text>
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={handleClearFields}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol 
            ios_icon_name="arrow.counterclockwise" 
            android_material_icon_name="refresh" 
            size={20} 
            color={colors.card} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Điền thông tin</Text>
          {fields.map((field, index) => (
            <View key={field.id} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>{field.name}</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder={field.placeholder}
                placeholderTextColor={colors.textSecondary}
                value={field.value}
                onChangeText={(value) => handleFieldChange(field.id, value)}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.previewHeader}>
            <Text style={styles.sectionTitle}>Xem trước</Text>
            <TouchableOpacity 
              style={styles.copyButton} 
              onPress={handleCopyToClipboard}
              activeOpacity={0.7}
            >
              <IconSymbol 
                ios_icon_name="doc.on.doc.fill" 
                android_material_icon_name="content_copy" 
                size={18} 
                color={colors.card} 
              />
              <Text style={styles.copyButtonText}>Sao chép</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.previewContainer}>
            <Text style={styles.previewText}>{generatedMessage}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={20} 
            color={colors.primary} 
          />
          <Text style={styles.infoText}>
            Sau khi sao chép, bạn có thể dán tin nhắn vào Zalo hoặc ứng dụng khác.
          </Text>
        </View>
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
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  fieldInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  copyButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(3, 169, 244, 0.3)',
    elevation: 3,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
    marginLeft: 6,
  },
  previewContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 150,
  },
  previewText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
});
