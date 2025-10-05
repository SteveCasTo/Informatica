import { StyleSheet, Dimensions, Animated } from 'react-native';

export const fadeAnim = new Animated.Value(0);
export const slideAnim = new Animated.Value(50);
export const scaleAnim = new Animated.Value(0.8);
export const pulseAnim = new Animated.Value(1);

export const float1 = new Animated.Value(0);
export const float2 = new Animated.Value(0);
export const float3 = new Animated.Value(0);

export const animDeps = [
  fadeAnim,
  slideAnim,
  scaleAnim,
  pulseAnim,
  float1,
  float2,
  float3,
];

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: '#fff',
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    bottom: 100,
    left: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    top: height * 0.3,
    right: 30,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoIcon: {
    fontSize: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 50,
    fontWeight: '300',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 50,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  googleButton: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  googleButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  googleIcon: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4285F4',
    marginRight: 15,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 17,
    fontWeight: '600',
  },
  termsText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});