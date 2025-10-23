
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, inputStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface WithdrawalHistory {
  id: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  transactionId: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: 'building.columns.fill',
    description: '2-3 business days',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'creditcard.fill',
    description: 'Instant transfer',
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: 'bitcoinsign.circle.fill',
    description: '10-30 minutes',
  },
];

const mockWithdrawalHistory: WithdrawalHistory[] = [
  {
    id: '1',
    amount: 2500,
    method: 'Bank Transfer',
    status: 'completed',
    date: '2024-01-15',
    transactionId: 'TXN001234',
  },
  {
    id: '2',
    amount: 1000,
    method: 'PayPal',
    status: 'pending',
    date: '2024-01-20',
    transactionId: 'TXN001235',
  },
  {
    id: '3',
    amount: 750,
    method: 'Cryptocurrency',
    status: 'completed',
    date: '2024-01-10',
    transactionId: 'TXN001233',
  },
];

export default function WithdrawScreen() {
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>(mockWithdrawalHistory);

  const availableBalance = 12450.75;
  const pendingWithdrawals = 1000; // Amount in pending withdrawals
  const withdrawableBalance = availableBalance - pendingWithdrawals;

  const handleWithdraw = () => {
    console.log('Withdraw request:', { amount, selectedPaymentMethod, accountNumber: '***' });
    
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > withdrawableBalance) {
      Alert.alert('Error', `Insufficient withdrawable balance. Available: $${withdrawableBalance.toLocaleString()}`);
      return;
    }

    if (!accountNumber.trim()) {
      Alert.alert('Error', 'Please enter your account details');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Add to withdrawal history
      const newWithdrawal: WithdrawalHistory = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        method: paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || '',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        transactionId: `TXN${Date.now()}`,
      };
      
      setWithdrawalHistory(prev => [newWithdrawal, ...prev]);
      
      Alert.alert(
        'Withdrawal Request Submitted!',
        `Your withdrawal request of $${parseFloat(amount).toLocaleString()} has been submitted successfully. Transaction ID: ${newWithdrawal.transactionId}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setAmount('');
              setAccountNumber('');
            }
          }
        ]
      );
    }, 1500);
  };

  const setQuickAmount = (percentage: number) => {
    const quickAmount = (withdrawableBalance * percentage / 100).toFixed(2);
    setAmount(quickAmount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'failed': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark.circle.fill';
      case 'pending': return 'clock.fill';
      case 'failed': return 'xmark.circle.fill';
      default: return 'circle.fill';
    }
  };

  const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={commonStyles.title}>Withdraw Funds</Text>
            <Text style={commonStyles.subtitle}>
              Transfer your earnings to your preferred account
            </Text>
          </View>

          {/* Balance Cards */}
          <View style={styles.balanceContainer}>
            <View style={[commonStyles.card, styles.balanceCard]}>
              <View style={styles.balanceHeader}>
                <IconSymbol name="wallet.pass.fill" size={24} color={colors.primary} />
                <Text style={styles.balanceLabel}>Total Balance</Text>
              </View>
              <Text style={styles.balanceAmount}>${availableBalance.toLocaleString()}</Text>
            </View>
            
            <View style={[commonStyles.card, styles.balanceCard]}>
              <View style={styles.balanceHeader}>
                <IconSymbol name="arrow.down.circle.fill" size={24} color={colors.success} />
                <Text style={styles.balanceLabel}>Withdrawable</Text>
              </View>
              <Text style={[styles.balanceAmount, { color: colors.success }]}>
                ${withdrawableBalance.toLocaleString()}
              </Text>
            </View>
          </View>

          {pendingWithdrawals > 0 && (
            <View style={styles.pendingCard}>
              <IconSymbol name="clock.fill" size={20} color={colors.warning} />
              <View style={styles.pendingContent}>
                <Text style={styles.pendingTitle}>Pending Withdrawals</Text>
                <Text style={styles.pendingAmount}>${pendingWithdrawals.toLocaleString()}</Text>
              </View>
            </View>
          )}

          {/* Amount Input */}
          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Withdrawal Amount</Text>
            
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Amount (USD)</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={[
                    inputStyles.input,
                    styles.amountInput,
                    focusedField === 'amount' && inputStyles.inputFocused
                  ]}
                  placeholder="0.00"
                  placeholderTextColor={colors.textSecondary}
                  value={amount}
                  onChangeText={setAmount}
                  onFocus={() => setFocusedField('amount')}
                  onBlur={() => setFocusedField('')}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.quickAmountContainer}>
              <Text style={styles.quickAmountLabel}>Quick amounts:</Text>
              <View style={styles.quickAmountButtons}>
                {[25, 50, 75, 100].map((percentage) => (
                  <TouchableOpacity
                    key={percentage}
                    style={styles.quickAmountButton}
                    onPress={() => setQuickAmount(percentage)}
                  >
                    <Text style={styles.quickAmountButtonText}>{percentage}%</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodOption,
                  selectedPaymentMethod === method.id && styles.paymentMethodSelected
                ]}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <View style={styles.paymentMethodLeft}>
                  <View style={[
                    styles.paymentMethodIcon,
                    selectedPaymentMethod === method.id && styles.paymentMethodIconSelected
                  ]}>
                    <IconSymbol 
                      name={method.icon as any} 
                      size={20} 
                      color={selectedPaymentMethod === method.id ? colors.card : colors.textSecondary} 
                    />
                  </View>
                  <View>
                    <Text style={[
                      styles.paymentMethodName,
                      selectedPaymentMethod === method.id && styles.paymentMethodNameSelected
                    ]}>
                      {method.name}
                    </Text>
                    <Text style={styles.paymentMethodDescription}>
                      {method.description}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedPaymentMethod === method.id && styles.radioButtonSelected
                ]}>
                  {selectedPaymentMethod === method.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Account Details */}
          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>
                {selectedMethod?.id === 'bank' ? 'Account Number' : 
                 selectedMethod?.id === 'paypal' ? 'PayPal Email' : 
                 'Wallet Address'}
              </Text>
              <View style={styles.inputContainer}>
                <IconSymbol 
                  name={selectedMethod?.id === 'bank' ? 'number' : 
                        selectedMethod?.id === 'paypal' ? 'envelope.fill' : 
                        'link'} 
                  size={20} 
                  color={focusedField === 'account' ? colors.primary : colors.textSecondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    inputStyles.input,
                    styles.inputWithIcon,
                    focusedField === 'account' && inputStyles.inputFocused
                  ]}
                  placeholder={
                    selectedMethod?.id === 'bank' ? 'Enter your account number' : 
                    selectedMethod?.id === 'paypal' ? 'Enter your PayPal email' : 
                    'Enter your wallet address'
                  }
                  placeholderTextColor={colors.textSecondary}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  onFocus={() => setFocusedField('account')}
                  onBlur={() => setFocusedField('')}
                  keyboardType={selectedMethod?.id === 'paypal' ? 'email-address' : 'default'}
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[buttonStyles.primary, styles.withdrawButton]}
              onPress={handleWithdraw}
              disabled={loading}
            >
              <IconSymbol name="arrow.down.circle.fill" size={20} color={colors.card} />
              <Text style={[commonStyles.buttonText, styles.withdrawButtonText]}>
                {loading ? 'Processing...' : 'Request Withdrawal'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.outline, styles.historyButton]}
              onPress={() => setShowHistory(true)}
            >
              <IconSymbol name="clock.arrow.circlepath" size={20} color={colors.primary} />
              <Text style={commonStyles.buttonTextOutline}>View History</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Processing Time</Text>
              <Text style={styles.infoText}>
                Withdrawals are processed within {selectedMethod?.description.toLowerCase()}. 
                You will receive a confirmation email once your request is approved.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Withdrawal History Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showHistory}
          onRequestClose={() => setShowHistory(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Withdrawal History</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowHistory(false)}
                >
                  <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.historyList}>
                {withdrawalHistory.map((withdrawal) => (
                  <View key={withdrawal.id} style={styles.historyItem}>
                    <View style={styles.historyLeft}>
                      <View style={[styles.historyIcon, { backgroundColor: `${getStatusColor(withdrawal.status)}20` }]}>
                        <IconSymbol 
                          name={getStatusIcon(withdrawal.status) as any} 
                          size={20} 
                          color={getStatusColor(withdrawal.status)} 
                        />
                      </View>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyAmount}>${withdrawal.amount.toLocaleString()}</Text>
                        <Text style={styles.historyMethod}>{withdrawal.method}</Text>
                        <Text style={styles.historyDate}>{withdrawal.date}</Text>
                      </View>
                    </View>
                    <View style={styles.historyRight}>
                      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(withdrawal.status)}20` }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(withdrawal.status) }]}>
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </Text>
                      </View>
                      <Text style={styles.transactionId}>ID: {withdrawal.transactionId}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for tab bar
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  balanceContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  balanceCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.warning}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  pendingContent: {
    marginLeft: 12,
    flex: 1,
  },
  pendingTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  pendingAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  amountInputContainer: {
    position: 'relative',
  },
  currencySymbol: {
    position: 'absolute',
    left: 16,
    top: 18,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    zIndex: 1,
  },
  amountInput: {
    paddingLeft: 40,
    fontSize: 18,
    fontWeight: '600',
  },
  quickAmountContainer: {
    marginTop: 12,
  },
  quickAmountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: colors.highlight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  quickAmountButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.highlight,
    marginBottom: 12,
  },
  paymentMethodSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMethodIconSelected: {
    backgroundColor: colors.primary,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  paymentMethodNameSelected: {
    color: colors.primary,
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  inputContainer: {
    position: 'relative',
  },
  inputWithIcon: {
    paddingLeft: 50,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  historyList: {
    flex: 1,
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  historyMethod: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  transactionId: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});
