import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

// import { ScreenContainer } from '../components/ScreenContainer';
// import { GradientButton } from '../components/GradientButton';
// import { useLogoutMutation } from '../features/auth/authApi';
// import { clearCredentials } from '../features/auth/authSlice';
// import { apiSlice } from '../features/api/apiSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCredentials } from '../app/features/auth/authSlice.ts';
import { apiSlice } from '../app/features/api/apiSlice.ts';
import { useLogoutMutation } from '../app/features/auth/authApi.ts';
import { ScreenContainer } from 'react-native-screens';
import { GradientButton } from '../app/components/GradientButton.tsx';
import Feather from '@react-native-vector-icons/feather';

export const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const [logout, { isLoading }] = useLogoutMutation();
  const [confirm, setConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      /* ignore — clear locally regardless */
    }
    dispatch(clearCredentials());
    dispatch(apiSlice.util.resetApiState());
    setConfirm(false);
  };

  const initial = user?.name?.[0]?.toUpperCase() ?? '?';

  return (
    <ScreenContainer>
      <View style={styles.root}>
        <View style={styles.avatarWrap}>
          <LinearGradient
            //@ts-ignore
            colors={['#7C3AED', '#EC4899']}
            style={styles.avatar}
          >
            <Text style={styles.avatarTxt}>{initial}</Text>
          </LinearGradient>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.card}>
          <Row icon="user" label="Account" />
          <Row icon="bell" label="Notifications" />
          <Row icon="shield" label="Privacy & Security" />
          <Row icon="help-circle" label="Help & Support" last />
        </View>

        <GradientButton
          title="Log Out"
          variant="danger"
          onPress={() => setConfirm(true)}
          style={{ marginTop: 24 }}
        />
      </View>

      <Modal
        transparent
        visible={confirm}
        animationType="fade"
        onRequestClose={() => setConfirm(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setConfirm(false)}>
          <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
            <View style={styles.sheetIcon}>
              <Feather name="log-out" size={22} color="#F87171" />
            </View>
            <Text style={styles.sheetTitle}>Log out?</Text>
            <Text style={styles.sheetBody}>
              You'll need to sign in again to access your account.
            </Text>
            <View style={styles.sheetActions}>
              <TouchableOpacity
                style={[styles.btn, styles.cancel]}
                onPress={() => setConfirm(false)}
              >
                <Text style={styles.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.danger]}
                onPress={handleLogout}
                disabled={isLoading}
              >
                <Text style={styles.dangerTxt}>
                  {isLoading ? 'Signing out…' : 'Log Out'}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
};

const Row = ({
  icon,
  label,
  last,
}: {
  icon: string;
  label: string;
  last?: boolean;
}) => (
  <TouchableOpacity style={[styles.row, last && { borderBottomWidth: 0 }]}>
    <View style={styles.rowIcon}>
      <Feather
        //@ts-ignore
        name={icon}
        size={18} color="#A78BFA" />
    </View>
    <Text style={styles.rowLabel}>{label}</Text>
    <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.3)" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  avatarWrap: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarTxt: { color: '#fff', fontSize: 40, fontWeight: '800' },
  name: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  email: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(167,139,250,0.12)',
  },
  rowLabel: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  sheet: {
    backgroundColor: '#1E1B34',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sheetIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(239,68,68,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  sheetBody: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 22,
  },
  sheetActions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  cancel: { backgroundColor: 'rgba(255,255,255,0.08)' },
  cancelTxt: { color: '#fff', fontWeight: '700' },
  danger: { backgroundColor: '#EF4444' },
  dangerTxt: { color: '#fff', fontWeight: '700' },
});
