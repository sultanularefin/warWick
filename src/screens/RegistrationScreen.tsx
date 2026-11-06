



import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator.tsx';

/*interface RegistrationScreenProps {
  navigation?: any;
}*/

interface RegistrationPayload {
  username: string;
  email: string;
  password: string;
  phone: string;
  country: string;
}

// Change this to your backend URL.
//
// For example:
// Android emulator:
// http://10.0.2.2:5000
//
// Physical device on same Wi-Fi:
// http://192.168.0.102:5000
//
// Mac localhost:
// http://127.0.0.1:5000
const API_BASE_URL = 'http://192.168.0.102:5000';

const REGISTER_ENDPOINT = `${API_BASE_URL}/api/auth/register`;


type Props = NativeStackScreenProps<RootStackParamList, 'RegistrationScreen'>;

export const RegistrationScreen = ({ navigation }: Props) => {
/*const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  navigation,
}) => {*/
  const [username, setUsername] = useState('arefin.nordecode');
  const [email, setEmail] = useState('arefin.nordecode2@gmail.com');
  const [password, setPassword] = useState('Jugantor212@!@');
  const [phone, setPhone] = useState('+8801302690921');
  const [country, setCountry] = useState('BD');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    phone?: string;
    country?: string;
  }>({});

  // ---------------------------------------------------------
  // Validation
  // ---------------------------------------------------------

  const validateUsername = (value: string): string | undefined => {
    const trimmed = value.trim();

    if (!trimmed) {
      return 'Username is required.';
    }

    if (trimmed.length < 3) {
      return 'Username must be at least 3 characters.';
    }

    if (trimmed.length > 30) {
      return 'Username cannot exceed 30 characters.';
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(trimmed)) {
      return 'Username can contain letters, numbers, ., _ and - only.';
    }

    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    const trimmed = value.trim();

    if (!trimmed) {
      return 'Email is required.';
    }

    // Reasonable application-level email validation.
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address.';
    }

    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return 'Password is required.';
    }

    if (value.length < 8) {
      return 'Password must be at least 8 characters.';
    }

    return undefined;
  };

  const validateCountry = (value: string): string | undefined => {
    const normalized = value.trim().toUpperCase();

    if (!normalized) {
      return 'Country is required.';
    }

    // ISO 3166-1 alpha-2 country code.
    if (!/^[A-Z]{2}$/.test(normalized)) {
      return 'Country must be a 2-letter country code, e.g. BD.';
    }

    return undefined;
  };

  const validatePhone = (value: string): string | undefined => {
    const trimmed = value.trim();

    if (!trimmed) {
      return 'Phone number is required.';
    }

    // International format:
    // +8801302690921
    //
    // Allows:
    // +880...
    // +1...
    // +44...
    // etc.
    if (!/^\+[1-9]\d{7,14}$/.test(trimmed)) {
      return 'Enter a valid international phone number.';
    }

    // Specific Bangladesh validation because country is BD.
    if (country.trim().toUpperCase() === 'BD') {
      if (!/^\+8801[3-9]\d{8}$/.test(trimmed)) {
        return 'Enter a valid Bangladesh mobile number.';
      }
    }

    return undefined;
  };

  const validateForm = (): boolean => {
    const validationErrors = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
      phone: validatePhone(phone),
      country: validateCountry(country),
    };

    setErrors(validationErrors);

    return !Object.values(validationErrors).some(Boolean);
  };

  // ---------------------------------------------------------
  // Registration
  // ---------------------------------------------------------

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    const payload: RegistrationPayload = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim(),
      country: country.trim().toUpperCase(),
    };

    try {
      setIsLoading(true);

      console.log('Registration payload:', {
        ...payload,
        password: '********',
      });

      const response = await fetch(REGISTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let responseData: any = null;

      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        const serverMessage =
          responseData?.message ||
          responseData?.error ||
          `Registration failed. Server returned ${response.status}.`;

        throw new Error(serverMessage);
      }

      Alert.alert(
        'Registration Successful',
        responseData?.message || 'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate after successful registration if needed.
              // navigation?.navigate('LoginScreen');
            },
          },
        ],
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to connect to the server.';

      Alert.alert('Registration Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Input helpers
  // ---------------------------------------------------------

  const clearError = (field: keyof typeof errors): void => {
    if (errors[field]) {
      setErrors(previous => ({
        ...previous,
        [field]: undefined,
      }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>

              <Text style={styles.subtitle}>
                Register a new account to continue.
              </Text>
            </View>

            {/* Username */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Username</Text>

              <TextInput
                value={username}
                onChangeText={value => {
                  setUsername(value);
                  clearError('username');
                }}
                placeholder="Enter username"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                style={[styles.input, errors.username && styles.inputError]}
              />

              {errors.username ? (
                <Text style={styles.errorText}>{errors.username}</Text>
              ) : null}
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email</Text>

              <TextInput
                value={email}
                onChangeText={value => {
                  setEmail(value);
                  clearError('email');
                }}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                editable={!isLoading}
                style={[styles.input, errors.email && styles.inputError]}
              />

              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Password</Text>

              <View
                style={[
                  styles.passwordContainer,
                  errors.password && styles.inputError,
                ]}
              >
                <TextInput
                  value={password}
                  onChangeText={value => {
                    setPassword(value);
                    clearError('password');
                  }}
                  placeholder="Enter password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  style={styles.passwordInput}
                />

                <Pressable
                  onPress={() => setShowPassword(previous => !previous)}
                  disabled={isLoading}
                  style={styles.showButton}
                >
                  <Text style={styles.showButtonText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>

              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            {/* Phone */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Phone</Text>

              <TextInput
                value={phone}
                onChangeText={value => {
                  setPhone(value);
                  clearError('phone');
                }}
                placeholder="+8801302690921"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                autoCapitalize="none"
                editable={!isLoading}
                style={[styles.input, errors.phone && styles.inputError]}
              />

              <Text style={styles.helperText}>
                Use international format, for example +8801302690921.
              </Text>

              {errors.phone ? (
                <Text style={styles.errorText}>{errors.phone}</Text>
              ) : null}
            </View>

            {/* Country */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Country</Text>

              <TextInput
                value={country}
                onChangeText={value => {
                  setCountry(value.toUpperCase());
                  clearError('country');
                }}
                placeholder="BD"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                maxLength={2}
                editable={!isLoading}
                style={[styles.input, errors.country && styles.inputError]}
              />

              <Text style={styles.helperText}>
                Enter the 2-letter ISO country code, for example BD.
              </Text>

              {errors.country ? (
                <Text style={styles.errorText}>{errors.country}</Text>
              ) : null}
            </View>

            {/* Register */}
            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.registerButton,
                pressed && !isLoading && styles.registerButtonPressed,
                isLoading && styles.registerButtonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </Pressable>

            <Text style={styles.serverText}>Server: {REGISTER_ENDPOINT}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },

  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },

  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
  },

  fieldContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#111827',
  },

  inputError: {
    borderColor: '#DC2626',
  },

  passwordContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#111827',
  },

  showButton: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
  },

  showButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },

  helperText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    color: '#6B7280',
  },

  errorText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    color: '#DC2626',
  },

  registerButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  registerButtonPressed: {
    opacity: 0.85,
  },

  registerButtonDisabled: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  serverText: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
  },
});

export default RegistrationScreen;