import { StyleSheet } from 'react-native';

export const tabHeight = 70;

export const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: tabHeight,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  iconContainerFocused: {
    backgroundColor: '#E8DEF8',
  },
  mainButtonContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8DEF8',
    marginBottom: 20,
  },
  mainButtonInactive: {
    backgroundColor: 'transparent',
    elevation: 2,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  mainButtonFocused: {
    backgroundColor: '#6750A4',
    elevation: 8,
    shadowColor: '#6750A4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    transform: [{ scale: 1.05 }],
  },
});