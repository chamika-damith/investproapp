
import React from "react";
import { Stack } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, commonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { LineChart, BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// Mock data for charts
const profitData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // colors.primary
      strokeWidth: 3,
    },
  ],
};

const growthData = {
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    {
      data: [65, 78, 90, 125],
      colors: [
        (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        (opacity = 1) => `rgba(250, 204, 21, ${opacity})`,
        (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
      ],
    },
  ],
};

const chartConfig = {
  backgroundColor: colors.card,
  backgroundGradientFrom: colors.card,
  backgroundGradientTo: colors.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: colors.primary,
  },
  propsForBackgroundLines: {
    strokeDasharray: "",
    stroke: colors.highlight,
    strokeWidth: 1,
  },
};

export default function HomeScreen() {
  const stats = [
    {
      icon: "chart.line.uptrend.xyaxis",
      label: "Total Revenue",
      value: "$2.4M",
      change: "+12.5%",
      color: colors.success,
    },
    {
      icon: "person.3.fill",
      label: "Active Users",
      value: "15.2K",
      change: "+8.2%",
      color: colors.primary,
    },
    {
      icon: "dollarsign.circle.fill",
      label: "Profit Margin",
      value: "24.8%",
      change: "+3.1%",
      color: colors.secondary,
    },
  ];

  const quickActions = [
    {
      icon: "plus.circle.fill",
      label: "New Investment",
      color: colors.primary,
      route: "/investment",
    },
    {
      icon: "arrow.down.circle.fill",
      label: "Withdraw",
      color: colors.success,
      route: "/withdraw",
    },
    {
      icon: "chart.bar.fill",
      label: "Analytics",
      color: colors.accent,
      route: "/analytics",
    },
    {
      icon: "person.circle.fill",
      label: "Profile",
      color: colors.secondary,
      route: "/profile",
    },
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: "InvestPro Dashboard",
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '600',
          },
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.welcomeSubtext}>Here's your portfolio overview</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <IconSymbol name="bell.fill" size={24} color={colors.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Company Introduction */}
        <View style={[commonStyles.card, styles.introCard]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>💼</Text>
          </View>
          <Text style={styles.companyName}>InvestPro</Text>
          <Text style={styles.companyTagline}>Your Trusted Investment Partner</Text>
          <Text style={styles.companyDescription}>
            We are a leading investment management company dedicated to helping individuals 
            and institutions achieve their financial goals through innovative investment 
            strategies and personalized portfolio management.
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <IconSymbol name="shield.checkered" size={20} color={colors.success} />
              <Text style={styles.featureText}>SEC Regulated</Text>
            </View>
            <View style={styles.feature}>
              <IconSymbol name="lock.shield.fill" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Bank-Level Security</Text>
            </View>
            <View style={styles.feature}>
              <IconSymbol name="star.fill" size={20} color={colors.secondary} />
              <Text style={styles.featureText}>Award Winning</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, { borderLeftColor: action.color }]}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                  <IconSymbol name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Key Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={[commonStyles.card, styles.statCard]}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <IconSymbol name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <View style={styles.statChange}>
                  <IconSymbol name="arrow.up.right" size={12} color={stat.color} />
                  <Text style={[styles.statChangeText, { color: stat.color }]}>
                    {stat.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Profit Trends Chart */}
        <View style={commonStyles.card}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Profit Trends</Text>
            <Text style={styles.chartSubtitle}>Monthly performance overview</Text>
          </View>
          <LineChart
            data={profitData}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            fromZero={true}
          />
        </View>

        {/* Business Growth Chart */}
        <View style={commonStyles.card}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Quarterly Growth</Text>
            <Text style={styles.chartSubtitle}>Revenue growth by quarter</Text>
          </View>
          <BarChart
            data={growthData}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            fromZero={true}
            withInnerLines={false}
          />
        </View>

        {/* Market Insights */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Market Insights</Text>
          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <IconSymbol name="chart.bar.fill" size={20} color={colors.success} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Market Performance</Text>
              <Text style={styles.insightDescription}>
                Strong quarterly performance with 15.2% average returns across all portfolios
              </Text>
            </View>
          </View>
          
          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <IconSymbol name="lightbulb.fill" size={20} color={colors.secondary} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Investment Opportunity</Text>
              <Text style={styles.insightDescription}>
                Tech sector showing promising growth potential for Q4 investments
              </Text>
            </View>
          </View>
          
          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Risk Assessment</Text>
              <Text style={styles.insightDescription}>
                Moderate volatility expected due to global economic factors
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100, // Space for tab bar
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  introCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
    background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 32,
  },
  companyName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  companyTagline: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  companyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
