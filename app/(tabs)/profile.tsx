
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles, inputStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
}

export default function ProfileScreen() {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            console.log('User logged out, navigating to login screen');
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings feature coming soon!');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Support feature coming soon!');
  };

  const handleEditPaymentDetails = () => {
    setShowPaymentModal(true);
  };

  const handleSavePaymentDetails = () => {
    if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.cardholderName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert('Success', 'Payment details saved successfully!');
    setShowPaymentModal(false);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return text;
    }
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileImageText}>👤</Text>
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>
        </View>

        {/* Profile Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="person.circle" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleEditPaymentDetails}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="creditcard" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Payment Details</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="gearshape" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="questionmark.circle" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="arrow.right.square" size={24} color={colors.error} />
              <Text style={[styles.menuItemText, { color: colors.error }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>InvestPro v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 InvestPro. All rights reserved.</Text>
        </View>
      </ScrollView>

      {/* Payment Details Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Payment Details</Text>
            <TouchableOpacity onPress={handleSavePaymentDetails}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Cardholder Name</Text>
              <TextInput
                style={inputStyles.input}
                placeholder="Enter cardholder name"
                value={paymentDetails.cardholderName}
                onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, cardholderName: text }))}
                autoCapitalize="words"
              />
            </View>

            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Card Number</Text>
              <TextInput
                style={inputStyles.input}
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, cardNumber: formatCardNumber(text) }))}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.row}>
              <View style={[inputStyles.container, { flex: 1, marginRight: 8 }]}>
                <Text style={inputStyles.label}>Expiry Date</Text>
                <TextInput
                  style={inputStyles.input}
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, expiryDate: formatExpiryDate(text) }))}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={[inputStyles.container, { flex: 1, marginLeft: 8 }]}>
                <Text style={inputStyles.label}>CVV</Text>
                <TextInput
                  style={inputStyles.input}
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, cvv: text.replace(/[^0-9]/g, '') }))}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Billing Address</Text>
              <TextInput
                style={[inputStyles.input, { height: 80 }]}
                placeholder="Enter billing address"
                value={paymentDetails.billingAddress}
                onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, billingAddress: text }))}
                multiline
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageText: {
    fontSize: 32,
    color: colors.card,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: colors.highlight,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
    backgroundColor: colors.card,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalCancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  modalSaveText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
