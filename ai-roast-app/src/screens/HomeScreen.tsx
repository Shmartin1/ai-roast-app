import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setImageUri, uploadImage, clearAnalysis } from '../store/slices/faceAnalysisSlice';
import { styles } from './styles/HomeScreen.styles';

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { imageUri, roast, loading, error } = useSelector((state: RootState) => state.faceAnalysis);

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

    dispatch(uploadImage(imageUri))
      .unwrap()
      .then(() => {
        console.log('Image uploaded and analyzed successfully');
      })
      .catch((error: string) => {
        console.error('Error uploading image:', error);
        Alert.alert('Error', error);
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

      {roast && (
        <View style={styles.roastContainer}>
          <Text style={styles.roastTitle}>AI Roast:</Text>
          <Text style={styles.roastText}>{roast}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default HomeScreen;