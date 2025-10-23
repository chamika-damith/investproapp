
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, inputStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  minInvestment: number;
  expectedReturn: string;
  duration: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  icon: string;
  color: string;
  isJoined?: boolean;
  investedAmount?: number;
  joinDate?: string;
}

const initialInvestmentPlans: InvestmentPlan[] = [
  {
    id: '1',
    name: 'Starter Portfolio',
    description: 'Perfect for beginners with diversified low-risk investments',
    minInvestment: 1000,
    expectedReturn: '8-12%',
    duration: '12 months',
    riskLevel: 'Low',
    icon: 'leaf.fill',
    color: colors.success,
  },
  {
    id: '2',
    name: 'Growth Fund',
    description: 'Balanced portfolio focusing on growth stocks and bonds',
    minInvestment: 5000,
    expectedReturn: '12-18%',
    duration: '24 months',
    riskLevel: 'Medium',
    icon: 'chart.line.uptrend.xyaxis',
    color: colors.primary,
    isJoined: true,
    investedAmount: 7500,
    joinDate: '2024-01-15',
  },
  {
    id: '3',
    name: 'Premium Strategy',
    description: 'High-yield investments for experienced investors',
    minInvestment: 10000,
    expectedReturn: '18-25%',
    duration: '36 months',
    riskLevel: 'High',
    icon: 'star.fill',
    color: colors.secondary,
    isJoined: true,
    investedAmount: 15000,
    joinDate: '2024-02-20',
  },
  {
    id: '4',
    name: 'Tech Innovation',
    description: 'Focus on emerging technology and AI companies',
    minInvestment: 7500,
    expectedReturn: '15-22%',
    duration: '18 months',
    riskLevel: 'High',
    icon: 'cpu.fill',
    color: colors.accent,
  },
  {
    id: '5',
    name: 'Sustainable Future',
    description: 'ESG-focused investments in renewable energy and sustainability',
    minInvestment: 3000,
    expectedReturn: '10-15%',
    duration: '30 months',
    riskLevel: 'Medium',
    icon: 'globe.americas.fill',
    color: colors.success,
  },
];

export default function InvestmentScreen() {
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>(initialInvestmentPlans);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'join' | 'update' | 'delete'>('join');
  const [investmentAmount, setInvestmentAmount] = useState('');

  const handleJoinNow = (plan: InvestmentPlan) => {
    console.log('Joining investment plan:', plan.name);
    setSelectedPlan(plan);
    setModalType('join');
    setInvestmentAmount(plan.minInvestment.toString());
    setModalVisible(true);
  };

  const handleUpdateInvestment = (plan: InvestmentPlan) => {
    console.log('Updating investment plan:', plan.name);
    setSelectedPlan(plan);
    setModalType('update');
    setInvestmentAmount(plan.investedAmount?.toString() || '');
    setModalVisible(true);
  };

  const handleDeleteInvestment = (plan: InvestmentPlan) => {
    console.log('Deleting investment plan:', plan.name);
    Alert.alert(
      'Delete Investment',
      `Are you sure you want to delete your investment in "${plan.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setInvestmentPlans(prev => 
              prev.map(p => 
                p.id === plan.id 
                  ? { ...p, isJoined: false, investedAmount: undefined, joinDate: undefined }
                  : p
              )
            );
            Alert.alert('Success!', `Your investment in ${plan.name} has been deleted.`);
          }
        }
      ]
    );
  };

  const handleModalConfirm = () => {
    if (!selectedPlan) return;

    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount < selectedPlan.minInvestment) {
      Alert.alert('Error', `Minimum investment amount is $${selectedPlan.minInvestment.toLocaleString()}`);
      return;
    }

    if (modalType === 'join') {
      setInvestmentPlans(prev => 
        prev.map(p => 
          p.id === selectedPlan.id 
            ? { 
                ...p, 
                isJoined: true, 
                investedAmount: amount, 
                joinDate: new Date().toISOString().split('T')[0] 
              }
            : p
        )
      );
      Alert.alert('Success!', `You have successfully joined the ${selectedPlan.name} investment plan with $${amount.toLocaleString()}!`);
    } else if (modalType === 'update') {
      setInvestmentPlans(prev => 
        prev.map(p => 
          p.id === selectedPlan.id 
            ? { ...p, investedAmount: amount }
            : p
        )
      );
      Alert.alert('Success!', `Your investment in ${selectedPlan.name} has been updated to $${amount.toLocaleString()}!`);
    }

    setModalVisible(false);
    setSelectedPlan(null);
    setInvestmentAmount('');
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return colors.success;
      case 'Medium': return colors.warning;
      case 'High': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const renderInvestmentPlan = (plan: InvestmentPlan) => (
    <View key={plan.id} style={[commonStyles.card, styles.planCard]}>
      <View style={styles.planHeader}>
        <View style={[styles.planIcon, { backgroundColor: plan.color }]}>
          <IconSymbol name={plan.icon as any} size={24} color={colors.card} />
        </View>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.riskBadge}>
            <View style={[styles.riskDot, { backgroundColor: getRiskColor(plan.riskLevel) }]} />
            <Text style={[styles.riskText, { color: getRiskColor(plan.riskLevel) }]}>
              {plan.riskLevel} Risk
            </Text>
          </View>
        </View>
        {plan.isJoined && (
          <View style={styles.joinedBadge}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
          </View>
        )}
      </View>

      <Text style={styles.planDescription}>{plan.description}</Text>

      {plan.isJoined && (
        <View style={styles.investmentInfo}>
          <View style={styles.investmentRow}>
            <Text style={styles.investmentLabel}>Invested Amount:</Text>
            <Text style={styles.investmentValue}>${plan.investedAmount?.toLocaleString()}</Text>
          </View>
          <View style={styles.investmentRow}>
            <Text style={styles.investmentLabel}>Join Date:</Text>
            <Text style={styles.investmentValue}>{plan.joinDate}</Text>
          </View>
        </View>
      )}

      <View style={styles.planDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <IconSymbol name="dollarsign.circle.fill" size={16} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Min. Investment</Text>
            <Text style={styles.detailValue}>${plan.minInvestment.toLocaleString()}</Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="percent" size={16} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Expected Return</Text>
            <Text style={styles.detailValue}>{plan.expectedReturn}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <IconSymbol name="clock.fill" size={16} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{plan.duration}</Text>
          </View>
        </View>
      </View>

      {plan.isJoined ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => handleUpdateInvestment(plan)}
            activeOpacity={0.8}
          >
            <IconSymbol name="pencil" size={16} color={colors.card} />
            <Text style={styles.actionButtonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={() => handleDeleteInvestment(plan)}
            activeOpacity={0.8}
          >
            <IconSymbol name="trash" size={16} color={colors.card} />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.joinButton, { backgroundColor: plan.color }]}
          onPress={() => handleJoinNow(plan)}
          activeOpacity={0.8}
        >
          <Text style={styles.joinButtonText}>Join Now</Text>
          <IconSymbol name="arrow.right" size={16} color={colors.card} />
        </TouchableOpacity>
      )}
    </View>
  );

  const joinedPlans = investmentPlans.filter(plan => plan.isJoined);
  const availablePlans = investmentPlans.filter(plan => !plan.isJoined);

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={commonStyles.title}>Investment Plans</Text>
            <Text style={commonStyles.subtitle}>
              Manage your investment portfolio and explore new opportunities
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
              <Text style={styles.statValue}>$2.4M+</Text>
              <Text style={styles.statLabel}>Total Invested</Text>
            </View>
            <View style={styles.statCard}>
              <IconSymbol name="person.3.fill" size={24} color={colors.success} />
              <Text style={styles.statValue}>1,250+</Text>
              <Text style={styles.statLabel}>Active Investors</Text>
            </View>
            <View style={styles.statCard}>
              <IconSymbol name="trophy.fill" size={24} color={colors.secondary} />
              <Text style={styles.statValue}>15.2%</Text>
              <Text style={styles.statLabel}>Avg. Return</Text>
            </View>
          </View>

          {joinedPlans.length > 0 && (
            <View style={styles.plansContainer}>
              <Text style={styles.sectionTitle}>My Investments</Text>
              {joinedPlans.map(renderInvestmentPlan)}
            </View>
          )}

          {availablePlans.length > 0 && (
            <View style={styles.plansContainer}>
              <Text style={styles.sectionTitle}>Available Plans</Text>
              {availablePlans.map(renderInvestmentPlan)}
            </View>
          )}
        </ScrollView>

        {/* Investment Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {modalType === 'join' ? 'Join Investment Plan' : 'Update Investment'}
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {selectedPlan && (
                <>
                  <View style={styles.modalPlanInfo}>
                    <View style={[styles.modalPlanIcon, { backgroundColor: selectedPlan.color }]}>
                      <IconSymbol name={selectedPlan.icon as any} size={24} color={colors.card} />
                    </View>
                    <Text style={styles.modalPlanName}>{selectedPlan.name}</Text>
                    <Text style={styles.modalPlanDescription}>{selectedPlan.description}</Text>
                  </View>

                  <View style={inputStyles.container}>
                    <Text style={inputStyles.label}>Investment Amount (USD)</Text>
                    <TextInput
                      style={inputStyles.input}
                      placeholder={`Minimum $${selectedPlan.minInvestment.toLocaleString()}`}
                      placeholderTextColor={colors.textSecondary}
                      value={investmentAmount}
                      onChangeText={setInvestmentAmount}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[buttonStyles.outline, styles.modalButton]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={commonStyles.buttonTextOutline}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[buttonStyles.primary, styles.modalButton]}
                      onPress={handleModalConfirm}
                    >
                      <Text style={commonStyles.buttonText}>
                        {modalType === 'join' ? 'Join Plan' : 'Update'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  plansContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  planCard: {
    marginBottom: 16,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '500',
  },
  joinedBadge: {
    padding: 4,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  investmentInfo: {
    backgroundColor: `${colors.success}10`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  investmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  investmentLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  investmentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  planDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalPlanInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalPlanIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalPlanName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  modalPlanDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
  },
});
