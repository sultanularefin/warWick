import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'danger';
  style?: ViewStyle;
}

export const GradientButton: React.FC<Props> = ({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  style,
}) => {
  const colors =
    variant === 'danger'
      ? (['#EF4444', '#DC2626'] as const)
      : // : (['#7C3AED', '#A855F7', '#EC4899'] as const);
        (['#ECFAAA', '#EFAAA4', '#ECFAAA'] as const);
  // colors={['#FFFBEB','#60A5FA', '#ECFDF5']}

  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      // activeOpacity={0.85}

      style={({ pressed }) => [
        // style={[
        styles.wrap,
        style,
        (loading || disabled) && { opacity: 0.7 },
        {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: pressed ? 'transparent' : '#E2E8F0',
          // backgroundColor: '#E2E8F0',
          // ...Password_Change_Styles.pressable_comp_image__password_wrapper,
        },
      ]}
    >
      {/*  <LinearGradient
        //@ts-ignore
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.btn}
      >*/}
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.txt}>{title}</Text>
      )}
      {/*</LinearGradient>*/}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  btn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: { color: '#111', fontSize: 16, fontWeight: '700', letterSpacing: 0.4 },
});
