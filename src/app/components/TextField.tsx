import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
// import Icon from 'react-native-vector-icons/Feather';

interface Props extends TextInputProps {
  label: string;
  icon: string;
  error?: string;
  isPassword?: boolean;
}

export const TextField: React.FC<Props> = ({
  label,
  icon,
  error,
  isPassword,
  style,
  ...rest
}) => {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}
      >
        <Feather
          //@ts-ignore
          name={icon}
          size={18}
          color={focused ? '#A78BFA' : 'rgba(255,255,255,0.45)'}
        />
        <TextInput
          {...rest}
          style={[styles.input, style]}
          placeholderTextColor="rgba(255,255,255,0.3)"
          secureTextEntry={isPassword && hidden}
          onFocus={e => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setHidden(h => !h)} hitSlop={12}>
            <Feather
              name={hidden ? 'eye-off' : 'eye'}
              size={18}
              color="rgba(255,255,255,0.45)"
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.err}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fieldFocused: {
    borderColor: '#A78BFA',
    backgroundColor: 'rgba(167,139,250,0.08)',
  },
  fieldError: { borderColor: '#F87171' },
  input: { flex: 1, color: '#fff', fontSize: 15, padding: 0 },
  err: { color: '#FCA5A5', fontSize: 12, marginTop: 6, marginLeft: 4 },
});
