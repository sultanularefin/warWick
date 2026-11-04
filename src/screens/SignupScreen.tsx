import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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
import { GradientButton } from '../app/components/GradientButton.tsx';
import { ScreenContainer } from '../app/components/ScreenContainer.tsx';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export const SignupScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    if (password.length < 8) e.password = 'At least 8 characters';
    if (confirm !== password) e.confirm = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      const res = await signup({
        name: name.trim(),
        email: email.trim(),
        password,
      }).unwrap();
      dispatch(setCredentials(res));
    } catch (err: any) {
      setErrors({
        general: err?.data?.message ?? 'Sign up failed. Please try again.',
      });
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{ opacity: fade, transform: [{ translateY: slide }] }}
          >
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
                label="Full name"
                icon="user"
                placeholder="Jane Doe"
                value={name}
                onChangeText={setName}
                error={errors.name}
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

              {errors.general && (
                <View style={styles.errorBox}>
                  <Feather name="alert-circle" size={16} color="#FCA5A5" />
                  <Text style={styles.errorTxt}>{errors.general}</Text>
                </View>
              )}

              <GradientButton
                title="Create Account"
                onPress={submit}
                loading={isLoading}
              />
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
  subtitle: { color: 'rgba(255,255,255,0.55)', fontSize: 15, marginBottom: 28 },
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
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  errorTxt: { color: '#FCA5A5', fontSize: 13, flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerTxt: { color: 'rgba(255,255,255,0.55)', fontSize: 14 },
  footerLink: { color: '#A78BFA', fontWeight: '700', fontSize: 14 },
});
