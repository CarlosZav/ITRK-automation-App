import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ConfigScreen = ({ navigation }) => {
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    // Cargar la dirección IP almacenada (si existe)
    const loadIpAddress = async () => {
      try {
        const savedIpAddress = await AsyncStorage.getItem('ServerURL');
        if (savedIpAddress) setIpAddress(savedIpAddress);
      } catch (error) {
        console.error("Error al cargar la dirección IP:", error);
      }
    };

    loadIpAddress();
  }, []);

  const saveIpAddress = async () => {
    try {
      await AsyncStorage.setItem('ServerURL', ipAddress);
      Alert.alert('Guardado', 'Dirección IP guardada con éxito.');
    } catch (error) {
      console.error("Error al guardar la dirección IP:", error);
      Alert.alert('Error', 'No se pudo guardar la dirección IP.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Dirección IP del servidor:</Text>
      <TextInput
        style={styles.input}
        value={ipAddress}
        onChangeText={setIpAddress}
        placeholder="Ejemplo: 192.168.16.162"
        keyboardType="numeric"
      />
      <Button title="Guardar" onPress={saveIpAddress} color="#FFD700" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default ConfigScreen;
