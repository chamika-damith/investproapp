
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles, inputStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('Login attempt with:', { email, password: '***' });
    
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - accept any email with password "123456" or any password for demo
      if (password === '123456' || password.length >= 6) {
        console.log('Login successful, navigating to main app');
        // Use replace to prevent going back to login screen
        router.replace('/(tabs)/(home)');
      } else {
        Alert.alert('Error', 'Invalid credentials. Use password "123456" or any password with 6+ characters for demo.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    console.log('Navigating to signup screen');
    router.push('/signup');
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      style={styles.gradient}
    >
      <SafeAreaView style={commonStyles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoEmoji}>💼</Text>
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={inputStyles.container}>
                <Text style={[inputStyles.label, { color: colors.card }]}>Email</Text>
                <View style={styles.inputContainer}>
                  <IconSymbol 
                    name="envelope.fill" 
                    size={20} 
                    color={emailFocused ? colors.primary : colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      inputStyles.input,
                      styles.inputWithIcon,
                      emailFocused && inputStyles.inputFocused
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
              </View>

              <View style={inputStyles.container}>
                <Text style={[inputStyles.label, { color: colors.card }]}>Password</Text>
                <View style={styles.inputContainer}>
                  <IconSymbol 
                    name="lock.fill" 
                    size={20} 
                    color={passwordFocused ? colors.primary : colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      inputStyles.input,
                      styles.inputWithIcon,
                      passwordFocused && inputStyles.inputFocused
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <IconSymbol 
                      name={showPassword ? "eye.slash.fill" : "eye.fill"} 
                      size={20} 
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[buttonStyles.secondary, styles.loginButton]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={[commonStyles.buttonText, { color: colors.text }]}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={navigateToSignup}>
                  <Text style={[styles.signupText, styles.signupLink]}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.demoText}>Demo: Use password "123456" with any email or any 6+ character password</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
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
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
    zIndex: 1,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  signupLink: {
    color: colors.secondary,
    fontWeight: '600',
  },
  demoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
