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
    borderRadius: 30,
  },
  analysisContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '100%',
  },
  roastContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ffe6e6',
    borderRadius: 10,
    width: '100%',
  },
  roastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roastText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
  },
  attributeContainer: {
    marginBottom: 5,
  },
  attributeKey: {
    fontWeight: 'bold',
  },
  attributeValue: {
    marginLeft: 10,
  },
  nestedContainer: {
    marginLeft: 20,
  },
});