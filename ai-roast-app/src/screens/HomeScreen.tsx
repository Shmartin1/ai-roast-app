import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

const HomeScreen = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
        });

        if (!result.didCancel && result.assets) {
            setImageUri(result.assets?.[0]?.uri ?? null);

        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Get Roasted!</Text>
            <Button title="Upload a Picture" onPress={pickImage} />
            {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.image} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
      borderRadius: 150,
    },
});

export default HomeScreen;