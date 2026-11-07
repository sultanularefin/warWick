


// RegistrationScreen.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  // SafeAreaView,
  // StatusBar,
  Animated,
} from 'react-native';
// import { StatusBar } from 'expo-status-bar';
import { ScreenContainer } from '../app/components/ScreenContainer.tsx';
// ---- Types ----
interface RegistrationData {
  username: string;
  email: string;
  password: string;
  phone: string;
  country: string;
}

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

// ---- Countries list (no external package) ----
const COUNTRIES: Country[] = [
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
];

// ---- Validation helpers ----
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,30}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim());
const validateUsername = (username: string): boolean =>
  USERNAME_REGEX.test(username.trim());
const validatePassword = (password: string): boolean =>
  PASSWORD_REGEX.test(password);

const validatePhone = (phone: string, country: Country): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (!/^\+?\d{6,15}$/.test(cleaned)) return false;

  // Country-specific dial code check
  if (country.dialCode) {
    const digitsOnly = cleaned.replace(/\+/g, '');
    const dialDigits = country.dialCode.replace(/\+/g, '');
    if (!digitsOnly.startsWith(dialDigits)) return false;

    const localPart = digitsOnly.slice(dialDigits.length);
    // Simple length checks per country (extendable)
    if (country.code === 'BD') return /^1\d{9}$/.test(localPart);
    if (country.code === 'US' || country.code === 'CA')
      return /^\d{10}$/.test(localPart);
    if (country.code === 'GB') return /^\d{9,10}$/.test(localPart);
    if (country.code === 'IN') return /^\d{10}$/.test(localPart);
    return localPart.length >= 6 && localPart.length <= 13;
  }
  return true;
};

const validateCountry = (code: string): boolean =>
  COUNTRIES.some((c) => c.code === code);

// ---- Server payload builder ----
const buildPayload = (data: RegistrationData) => ({
  username: data.username.trim(),
  email: data.email.trim().toLowerCase(),
  password: data.password,
  phone: data.phone.replace(/[\s\-()]/g, ''),
  country: data.country,
});

// ---- Reusable Components ----
interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  showToggle?: boolean;
  toggleVisible?: boolean;
  onToggle?: () => void;
  leftAddon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
                                                 label,
                                                 value,
                                                 onChangeText,
                                                 placeholder,
                                                 error,
                                                 secureTextEntry,
                                                 keyboardType = 'default',
                                                 autoCapitalize = 'none',
                                                 showToggle,
                                                 toggleVisible,
                                                 onToggle,
                                                 leftAddon,
                                               }) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
      {leftAddon}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
      {showToggle && (
        <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
          <Text style={styles.eyeIcon}>{toggleVisible ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      )}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

// ---- Main Screen ----
export default function RegScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find(c => c.code === 'BD') as Country,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCountries = COUNTRIES.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );


  const validateAll = useCallback((): boolean => {
    const next: Record<string, string> = {};

    if (!username.trim()) next.username = 'Username is required';
    else if (!validateUsername(username))
      next.username = '3–30 chars: letters, numbers, . _ -';

    if (!email.trim()) next.email = 'Email is required';
    else if (!validateEmail(email)) next.email = 'Enter a valid email address';

    if (!password) next.password = 'Password is required';
    else if (!validatePassword(password))
      next.password =
        'Min 8 chars, uppercase, lowercase, number & special char';

    if (!phone.trim()) next.phone = 'Phone number is required';
    else if (!validatePhone(phone, selectedCountry))
      next.phone = `Invalid phone number for ${selectedCountry.name} (${selectedCountry.dialCode})`;

    if (!validateCountry(selectedCountry.code))
      next.country = 'Please select a valid country';

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [username, email, password, phone, selectedCountry]);

  const submit = async () => {
    if (!validateAll()) return;

    const payload = buildPayload({
      username,
      email,
      password,
      phone,
      country: selectedCountry.code,
    });

    try {
      setSubmitting(true);

      // ---- Replace URL with your API endpoint ----
      const API_URL = 'https://your-api.example.com/api/register';
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Server responded ${response.status}: ${errBody}`);
      }

      const result = await response.json();
      Alert.alert('Success', 'Registration completed successfully!', [
        { text: 'OK', onPress: () => console.log('Server:', result) },
      ]);

      // Reset (optional)
      setUsername('');
      setEmail('');
      setPassword('');
      setPhone('');
      setErrors({});
    } catch (err: any) {
      Alert.alert(
        'Registration Failed',
        err?.message ?? 'Something went wrong. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };
  // <SafeAreaView style={styles.safe}>

    /*<StatusBar barStyle="light-content" />*/
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);


  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{ opacity: fade, transform: [{ translateY: slide }] }}
          >
            {/*<KeyboardAvoidingView*/}
            {/*  style={{ flex: 1 }}*/}
            {/*  behavior={Platform.OS === 'ios' ? 'padding' : undefined}*/}
            {/*>*/}
            {/* <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >*/}
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>NR</Text>
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join us today — it only takes a minute
              </Text>
            </View>

            {/* Form card */}
            <View style={styles.card}>
              <InputField
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="e.g. arefin.nordecode"
                error={errors.username}
                autoCapitalize="none"
              />

              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                error={errors.email}
                autoCapitalize="none"
              />

              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                error={errors.password}
                showToggle
                toggleVisible={showPassword}
                onToggle={() => setShowPassword(v => !v)}
              />

              {/* Country selector */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Country</Text>
                <TouchableOpacity
                  style={[
                    styles.inputRow,
                    styles.selectRow,
                    errors.country ? styles.inputRowError : null,
                  ]}
                  onPress={() => setCountryModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.flag}>{selectedCountry.flag}</Text>
                  <Text style={styles.countryName}>{selectedCountry.name}</Text>
                  <Text style={styles.dialCode}>
                    {selectedCountry.dialCode}
                  </Text>
                  <Text style={styles.chevron}>▾</Text>
                </TouchableOpacity>
                {errors.country ? (
                  <Text style={styles.errorText}>{errors.country}</Text>
                ) : null}
              </View>

              {/* Phone with country dial code prefix */}
              <InputField
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder={`${selectedCountry.dialCode} 1XXXXXXXXX`}
                keyboardType="phone-pad"
                error={errors.phone}
                leftAddon={
                  <Text style={styles.phonePrefix}>
                    {selectedCountry.dialCode}
                  </Text>
                }
              />

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  submitting && styles.submitBtnDisabled,
                ]}
                onPress={submit}
                disabled={submitting}
                activeOpacity={0.85}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.terms}>
                By signing up, you agree to our{' '}
                <Text style={styles.link}>Terms &amp; Conditions</Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Picker Modal */}
      <Modal
        visible={countryModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setCountryModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search country..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={item => item.code}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const active = item.code === selectedCountry.code;
                return (
                  <TouchableOpacity
                    style={[
                      styles.countryItem,
                      active && styles.countryItemActive,
                    ]}
                    onPress={() => {
                      setSelectedCountry(item);
                      setCountryModalVisible(false);
                      setSearchQuery('');
                    }}
                  >
                    <Text style={styles.itemFlag}>{item.flag}</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDial}>{item.dialCode}</Text>
                    {active ? <Text style={styles.checkMark}>✓</Text> : null}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
            />
          </View>
        </View>
      </Modal>
      {/*</SafeAreaView>*/}
    </ScreenContainer>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  safe: { flex: 1, backgroundColor: '#F6F8FB' },
  scrollContent: { padding: 20, paddingBottom: 40 },

  header: { alignItems: 'center', marginTop: 12, marginBottom: 24 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  logoText: { color: '#fff', fontSize: 26, fontWeight: '800' },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginTop: 16 },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  fieldWrapper: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    minHeight: 50,
  },
  inputRowError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  eyeBtn: { padding: 6 },
  eyeIcon: { fontSize: 18 },

  phonePrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4F46E5',
    marginRight: 6,
  },

  selectRow: { paddingVertical: 12 },
  flag: { fontSize: 20, marginRight: 10 },
  countryName: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
  dialCode: { fontSize: 14, color: '#6B7280', marginRight: 8 },
  chevron: { fontSize: 16, color: '#9CA3AF' },

  errorText: { color: '#EF4444', fontSize: 12, marginTop: 6, marginLeft: 2 },

  submitBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  terms: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 14,
  },
  link: { color: '#4F46E5', fontWeight: '600' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  closeBtn: { fontSize: 18, color: '#6B7280' },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827', paddingVertical: 12 },

  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  countryItemActive: { backgroundColor: '#EEF2FF' },
  itemFlag: { fontSize: 22, marginRight: 12 },
  itemName: { flex: 1, fontSize: 15, color: '#111827' },
  itemDial: { fontSize: 14, color: '#6B7280' },
  checkMark: {
    fontSize: 16,
    color: '#4F46E5',
    marginLeft: 10,
    fontWeight: '700',
  },
  sep: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 20 },
});