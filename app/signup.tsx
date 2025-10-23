
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles, inputStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    console.log('Signup attempt with:', { fullName, email, password: '***' });
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      console.log('Signup successful');
      Alert.alert(
        'Success!', 
        'Account created successfully! You have received LKR 250 as a welcome bonus. Please sign in with your new credentials.',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Navigating to login screen');
              // Clear form data
              setFullName('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setErrors({});
              // Navigate to login
              router.replace('/login');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    console.log('Navigating to login screen');
    router.back();
  };

  return (
    <LinearGradient
      colors={[colors.accent, colors.primary]}
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
              <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
                <IconSymbol name="chevron.left" size={24} color={colors.card} />
              </TouchableOpacity>
              
              <View style={styles.logoContainer}>
                <Text style={styles.logoEmoji}>🚀</Text>
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join us and start investing</Text>
              
              {/* Registration Bonus Banner */}
              <View style={styles.bonusBanner}>
                <IconSymbol name="gift.fill" size={24} color={colors.secondary} style={styles.bonusIcon} />
                <View style={styles.bonusTextContainer}>
                  <Text style={styles.bonusTitle}>Welcome Bonus!</Text>
                  <Text style={styles.bonusText}>Get LKR 250 when you register</Text>
                </View>
              </View>
            </View>

            <View style={styles.formContainer}>
              <View style={inputStyles.container}>
                <Text style={[inputStyles.label, { color: colors.card }]}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <IconSymbol 
                    name="person.fill" 
                    size={20} 
                    color={focusedField === 'fullName' ? colors.primary : colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      inputStyles.input,
                      styles.inputWithIcon,
                      focusedField === 'fullName' && inputStyles.inputFocused,
                      errors.fullName && inputStyles.error
                    ]}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textSecondary}
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      if (errors.fullName) {
                        setErrors(prev => ({ ...prev, fullName: '' }));
                      }
                    }}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField('')}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
                {errors.fullName && <Text style={inputStyles.errorText}>{errors.fullName}</Text>}
              </View>

              <View style={inputStyles.container}>
                <Text style={[inputStyles.label, { color: colors.card }]}>Email</Text>
                <View style={styles.inputContainer}>
                  <IconSymbol 
                    name="envelope.fill" 
                    size={20} 
                    color={focusedField === 'email' ? colors.primary : colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      inputStyles.input,
                      styles.inputWithIcon,
                      focusedField === 'email' && inputStyles.inputFocused,
                      errors.email && inputStyles.error
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: '' }));
                      }
                    }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
                {errors.email && <Text style={inputStyles.errorText}>{errors.email}</Text>}
              </View>

              <View style={inputStyles.container}>
                <Text style={[inputStyles.label, { color: colors.card }]}>Password</Text>
                <View style={styles.inputContainer}>
                  <IconSymbol 
                    name="lock.fill" 
                    size={20} 
                    color={focusedField === 'password' ? colors.primary : colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      inputStyles.input,
                      styles.inputWithIcon,
                      focusedField === 'password' && inputStyles.inputFocused,
                      errors.password && inputStyles.error
                    ]}
                    placeholder="Create a password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: '' }));
                      }
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
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
                {errors.password && <Text style={inputStyles.errorText}>{errors.password}</Text>}
              </View>

              <View style={inputStyles.container}>
                <Text style={[inputStyles.label, { color: colors.card }]}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <IconSymbol 
                    name="lock.fill" 
                    size={20} 
                    color={focusedField === 'confirmPassword' ? colors.primary : colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      inputStyles.input,
                      styles.inputWithIcon,
                      focusedField === 'confirmPassword' && inputStyles.inputFocused,
                      errors.confirmPassword && inputStyles.error
                    ]}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textSecondary}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword) {
                        setErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }
                    }}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSignup}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <IconSymbol 
                      name={showConfirmPassword ? "eye.slash.fill" : "eye.fill"} 
                      size={20} 
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={inputStyles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              <TouchableOpacity
                style={[buttonStyles.secondary, styles.signupButton]}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={[commonStyles.buttonText, { color: colors.text }]}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text style={[styles.loginText, styles.loginLink]}>Sign In</Text>
                </TouchableOpacity>
              </View>
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
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
    zIndex: 1,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
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
    marginBottom: 20,
  },
  bonusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.secondary,
    width: '100%',
  },
  bonusIcon: {
    marginRight: 12,
  },
  bonusTextContainer: {
    flex: 1,
  },
  bonusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 2,
  },
  bonusText: {
    fontSize: 14,
    color: colors.card,
    fontWeight: '500',
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
  signupButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loginLink: {
    color: colors.secondary,
    fontWeight: '600',
  },
});
