import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardContent: {
    alignItems: 'center',
  },
  username: {
    marginTop: 12,
    fontWeight: '700',
    color: '#333',
  },
  email: {
    marginTop: 4,
    color: '#666',
  },
  logoutButton: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#6750A4',
  },
});