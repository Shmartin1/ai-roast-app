import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { styles } from './styles/HomeScreen.styles';

const AnalysisDisplay = ({ analysis }: { analysis: any }) => {
  if (!analysis) return null;

  const renderValue = (value: any): React.ReactNode => {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return (
          <View style={{ marginLeft: 10 }}>
            {value.map((item, index) => (
              <Text key={index}>{renderValue(item)}</Text>
            ))}
          </View>
        );
      }
      return renderObject(value);
    }
    return value.toString();
  };

  const renderObject = (obj: any) => {
    return (
      <View style={{ marginLeft: 10 }}>
        {Object.entries(obj).map(([key, value]) => (
          <View key={key}>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>{key}:</Text>{' '}
              {typeof value === 'object' && value !== null ? '\n' : renderValue(value)}
            </Text>
            {typeof value === 'object' && value !== null && renderValue(value)}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.analysisContainer}>
      {analysis.map((face: any, index: number) => (
        <View key={index} style={styles.faceContainer}>
          <Text style={styles.faceTitle}>Face {index + 1}</Text>
          {renderObject(face)}
        </View>
      ))}
    </View>
  );
};

const HomeScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission to access the camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log('Image picker result:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setAnalysis(null);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      console.log('No image selected');
      return;
    }
  
    setLoading(true);
  
    console.log('Preparing to upload image:', imageUri);
  
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);
  
    console.log('FormData created:', formData);
  
    try {
      console.log('Sending request to server...');
      console.log('Request URL:', 'http://192.168.1.14:3000/upload');
  
      const response = await axios.post('http://192.168.1.14:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes
      });
  
      console.log('Server response status:', response.status);
      console.log('Server response data:', JSON.stringify(response.data, null, 2));
  
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.analysis) && response.data.analysis.length > 0) {
          setAnalysis(response.data.analysis);
        } else {
          console.log('No analysis data available');
          setAnalysis(null);
          Alert.alert('Info', 'No face detected in the image');
        }
      } else {
        console.error('Unexpected response format:', response.data);
        Alert.alert('Error', 'Unexpected response from server');
      }
    } catch (error) {
      console.error('Full error object:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response data:', error.response.data);
          Alert.alert('Server Error', `${error.response.data.error}\n\nDetails: ${error.response.data.details}`);
        } else if (error.request) {
          console.error('Error request:', error.request);
          Alert.alert('Network Error', 'No response received from the server. Please check your connection and try again.');
        } else {
          Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred while processing the image.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Face Analysis</Text>
      <Button title="Upload a Picture" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      
      {imageUri && (
        <Button title="Analyze Image" onPress={uploadImage} />
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <AnalysisDisplay analysis={analysis} />
    </ScrollView>
  );
};

export default HomeScreen;