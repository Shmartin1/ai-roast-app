import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 150,
  },
  analysisContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '100%',
  },
  faceContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  attributeContainer: {
    marginLeft: 10,
    marginBottom: 5,
  },
  attributeKey: {
    fontWeight: 'bold',
  },
  attributeValue: {
    marginLeft: 5,
  },
  nestedContainer: {
    marginLeft: 15,
  },
});