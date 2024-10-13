import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setImageUri, uploadImage, clearAnalysis } from '../store/slices/faceAnalysisSlice';
import { styles } from './styles/HomeScreen.styles';

const AnalysisDisplay = ({ analysis }: { analysis: any[] | null }) => {
  if (!analysis) return null;

  const renderValue = (value: any): React.ReactNode => {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return (
          <View style={styles.nestedContainer}>
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
      <View style={styles.nestedContainer}>
        {Object.entries(obj).map(([key, value]) => (
          <View key={key} style={styles.attributeContainer}>
            <Text>
              <Text style={styles.attributeKey}>{key}:</Text>
              <Text style={styles.attributeValue}>
                {typeof value === 'object' && value !== null ? '\n' : ` ${renderValue(value)}`}
              </Text>
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
  const dispatch = useDispatch<AppDispatch>();
  const { imageUri, analysis, loading, error } = useSelector((state: RootState) => state.faceAnalysis);

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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      dispatch(setImageUri(result.assets[0].uri));
    }
  };

  const handleUploadImage = async () => {
    if (!imageUri) {
      console.log('No image selected');
      return;
    }

    dispatch(uploadImage(imageUri)).unwrap()
      .then(() => {
        console.log('Image uploaded and analyzed successfully');
      })
      .catch((error: any) => {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'An error occurred while uploading and analyzing the image.');
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Face Analysis</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={pickImage}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Upload a Picture</Text>
        </View>
      </TouchableOpacity>
      
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      
      {imageUri && (
        <TouchableOpacity style={styles.buttonContainer} onPress={handleUploadImage}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Analyze Image</Text>
          </View>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <AnalysisDisplay analysis={analysis} />
    </ScrollView>
  );
};

export default HomeScreen;