import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const getScore = (pw: string) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const COLORS = ['#3F3F46', '#EF4444', '#F59E0B', '#10B981', '#22D3EE'];

export const PasswordStrength = ({ password }: { password: string }) => {
  if (!password) return null;
  const score = getScore(password);
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4].map(i => (
        <View
          key={i}
          style={[
            styles.bar,
            { backgroundColor: i <= score ? COLORS[score] : '#3F3F46' },
          ]}
        />
      ))}
      <Text style={[styles.txt, { color: COLORS[score] }]}>
        {LABELS[score]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -6,
    marginBottom: 14,
  },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  txt: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
    width: 52,
    textAlign: 'right',
  },
});
