import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// import { ScreenContainer } from '../components/ScreenContainer';
// import { TextField } from '../components/TextField';
// import { GradientButton } from '../components/GradientButton';
// import { PasswordStrength } from '../components/PasswordStrength';
// import { useSignupMutation } from '../features/auth/authApi';
// import { setCredentials } from '../features/auth/authSlice';
import { useAppDispatch } from '../app/hooks';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSignupMutation } from '../app/features/auth/authApi.ts';
// import { ScreenContainer } from 'react-native-screens';
import { setCredentials } from '../app/features/auth/authSlice.ts';
import Feather from '@react-native-vector-icons/feather';
import { TextField } from '../app/components/TextField.tsx';
import { PasswordStrength } from '../app/components/PasswordStrength.tsx';
// import { GradientButton } from '../app/components/GradientButton.tsx';
import { ScreenContainer } from '../app/components/ScreenContainer.tsx';
import { Country } from '../types/auth_Types.ts';
import { COUNTRIES } from '../constants/auth_Constants.ts';
import {
  validateCountry,
  validateEmail,
  validatePassword,
  validatePhone,
  validateUsername,
} from '../utils/auth_Helpers.ts';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;





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



export const SignupScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();



  // const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find(c => c.code === 'BD') as Country,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const filteredCountries = COUNTRIES.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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


    // const e: Record<string, string> = {};
    // if (!name.trim()) e.Username = 'Name is required';

    // if (!email.trim()) e.email = 'Email is required';
    // else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';

    // if (password.length < 8) e.password = 'At least 8 characters';
    if (confirm !== password) next.confirm = 'Passwords do not match';
    // setErrors(e);
    // if (Object.keys(e).length) return;

    if (!phone.trim()) next.phone = 'Phone number is required';
    else if (!validatePhone(`${selectedCountry.dialCode}${phone}`, selectedCountry)) {
      next.phone = `Invalid phone number for ${selectedCountry.name} (${selectedCountry.dialCode})`;
    }


    if (!validateCountry(selectedCountry.code))
      next.country = 'Please select a valid country';

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [username, email, password, confirm, phone, selectedCountry]);



  const submit = async () => {

    if (!validateAll()) {
      return;
    }


    try {
      setSubmitting(true);
      const res = await signup({
        // Username: Username.trim(),
        // email: email.trim(),
        // password,

        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        phone: phone.replace(/[\s\-()]/g, ''),
        // country: country,
        country:
          /*COUNTRIES.find(country => country.name === selectedCountry)!
          .code,*/ selectedCountry.code,
      }).unwrap();
      if(res.success){
        Alert.alert('success',res.message);
        setErrors({
          general:
            res.message,// err?.data?.message ??
            // 'Sign up failed. Please try again.',
        });
        dispatch(setCredentials(res));
      }else{
        Alert.alert(res.message);
      }

    } catch (err: any) {
      setErrors({
        general: err?.data?.message ?? 'Sign up failed. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

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
                          {active ? (
                            <Text style={styles.checkMark}>✓</Text>
                          ) : null}
                        </TouchableOpacity>
                      );
                    }}
                    ItemSeparatorComponent={() => <View style={styles.sep} />}
                  />
                </View>
              </View>
            </Modal>

            <View style={styles.logoRow}>
              <LinearGradient
                //@ts-ignore
                colors={['#7C3AED', '#EC4899']}
                style={styles.logo}
              >
                <Feather name="zap" size={30} color="#fff" />
              </LinearGradient>
              <Text style={styles.brand}>Nimbus</Text>
            </View>

            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Start your journey in under a minute.
            </Text>

            <View style={styles.card}>
              <TextField
                label="Username"
                icon="user"
                placeholder="JaneDoe"
                value={username}
                onChangeText={setUsername}
                error={errors.Username}
              />
              <TextField
                label="Email"
                icon="mail"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                error={errors.email}
              />
              <TextField
                label="Password"
                icon="lock"
                placeholder="Create a password"
                isPassword
                value={password}
                onChangeText={setPassword}
                error={errors.password}
              />
              <PasswordStrength password={password} />
              <TextField
                label="Confirm password"
                icon="shield"
                placeholder="Repeat your password"
                isPassword
                value={confirm}
                onChangeText={setConfirm}
                error={errors.confirm}
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
                // placeholder={`${selectedCountry.dialCode} 1XXXXXXXXX`}
                placeholder={`1XXXXXXXXX`}
                keyboardType="phone-pad"
                error={errors.phone}
                leftAddon={
                  <Text style={styles.phonePrefix}>
                    {selectedCountry.dialCode}
                  </Text>
                }
              />

              {errors.general && (
                <View style={styles.errorBox}>
                  <Feather name="alert-circle" size={16} color="#FCA5A5" />
                  <Text style={styles.errorTxt}>{errors.general}</Text>
                </View>
              )}

              {/* <GradientButton
                title="Create Account"
                onPress={submit}
                loading={isLoading}
                style={{
                  height: 50,
                }}
              />*/}

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (submitting || isLoading) && styles.submitBtnDisabled,
                ]}
                onPress={submit}
                disabled={submitting || isLoading}
                activeOpacity={0.85}
              >
                {submitting || isLoading ? (
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

            <View style={styles.footer}>
              <Text style={styles.footerTxt}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 36,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  title: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 6 },
  // subtitle: { color: 'rgba(255,255,255,0.55)', fontSize: 15, marginBottom: 28 },
  subtitle: { color: 'rgba(0,0,0,0.55)', fontSize: 15, marginBottom: 28 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 22,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    // backgroundColor: 'rgba(239,68,68,0.12)',
    backgroundColor: 'lemonchiffon', //'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  // errorTxt: { color: '#FCA5A5', fontSize: 13, flex: 1 },
  errorTxt: { color: 'tomato', fontSize: 13, flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  // footerTxt: { color: 'rgba(255,255,255,0.55)', fontSize: 14 },
  footerTxt: { color: 'rgba(1,1,1,0.55)', fontSize: 14 },
  footerLink: { color: '#A78BFA', fontWeight: '700', fontSize: 14 },

  // new begins here
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
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 6, marginLeft: 2 },
  selectRow: { paddingVertical: 12 },

  flag: { fontSize: 20, marginRight: 10 },
  countryName: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
  dialCode: { fontSize: 14, color: '#6B7280', marginRight: 8 },
  chevron: { fontSize: 16, color: '#9CA3AF' },

  phonePrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4F46E5',
    marginRight: 6,
  },

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
    // color: 'steelblue', //'#9CA3AF',
    color: 'yellow',
    textAlign: 'center',
    marginTop: 14,
  },
  link: { color: '#4F46E5', fontWeight: '600' },

  // Modal

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
