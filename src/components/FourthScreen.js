import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
 
const FourthScreen = ({ navigation }) => {
 
  const [day, setDay] = useState('01');
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');
  const [second, setSecond] = useState('00');
 
  const [day2, setDay2] = useState('01');
  const [hour2, setHour2] = useState('00');
  const [minute2, setMinute2] = useState('00');
  const [second2, setSecond2] = useState('00');
 
const esp8266IP = "http://192.168.95.167";  // Cambia esto con la IP de tu ESP8266
 
  // Función para enviar datos a la ESP8266
  const enviarDatos = async () => {
    try {
      const datos = {
        encendido: `${day} ${hour}:${minute}:${second}`,
        apagado: `${day2} ${hour2}:${minute2}:${second2}`,
      };
 
      const response = await fetch(`${esp8266IP}/enviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });
 
      const result = await response.text();
      Alert.alert('Respuesta de ESP8266', result);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      Alert.alert('Error', 'No se pudieron enviar los datos.');
    }
  };
 
  // Función para recibir datos de la ESP8266
  const recibirDatos = async () => {
    try {
      const response = await fetch(`${esp8266IP}/recibir`, {
        method: 'GET',
      });
 
      const result = await response.text();
      Alert.alert('Datos recibidos de ESP8266', result);
    } catch (error) {
      console.error("Error al recibir los datos:", error);
      Alert.alert('Error', 'No se pudieron recibir los datos.');
    }
  };
 
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Maquina3.png')}
        style={styles.image}
      />
 
      <Text style={styles.title}>TIEMPO DE ENCENDIDO</Text>
            <View style={styles.pickerRow}>
              {/* Día */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Día</Text>
                <View style={styles.pickerContainer}>
                  <Text style={styles.selectedValue}>:{day}</Text>
                  <Picker
                    selectedValue={day}
                    style={styles.picker}
                    onValueChange={(itemValue) => setDay(itemValue)}
                  >
                    {[...Array(32).keys()].map((day) => (
                      <Picker.Item key={day} label={(day).toString().padStart(2, '0')} value={day} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Hora */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Hora</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{hour}</Text>
                  <Picker
                    selectedValue={hour}
                    style={styles.picker}
                    onValueChange={(itemValue) => setHour(itemValue)}
                  >
                    {[...Array(24).keys()].map((hour) => (
                      <Picker.Item key={hour} label={hour.toString().padStart(2, '0')} value={hour} />
                    ))}
                  </Picker>
                </View>
              </View>
 
              {/* Minuto */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Minuto</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{minute}</Text>
                  <Picker
                    selectedValue={minute}
                    style={styles.picker}
                    onValueChange={(itemValue) => setMinute(itemValue)}
                  >
                    {[...Array(60).keys()].map((minute) => (
                      <Picker.Item key={minute} label={minute.toString().padStart(2, '0')} value={minute} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Segundo */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Segundo</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{second}</Text>
                  <Picker
                    selectedValue={second}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSecond(itemValue)}
                  >
                    {[...Array(60).keys()].map((second) => (
                      <Picker.Item key={second} label={second.toString().padStart(2, '0')} value={second} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
 
            <Text style={styles.title}>TIEMPO DE APAGADO</Text>
            <View style={styles.pickerRow}>
              {/* Día */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Día</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{day2}</Text>
                  <Picker
                    selectedValue={day2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setDay2(itemValue)}
                  >
                    {[...Array(32).keys()].map((day) => (
                      <Picker.Item key={day} label={(day).toString().padStart(2, '0')} value={day} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Hora */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Hora</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{hour2}</Text>
                  <Picker
                    selectedValue={hour2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setHour2(itemValue)}
                  >
                    {[...Array(24).keys()].map((hour) => (
                      <Picker.Item key={hour} label={hour.toString().padStart(2, '0')} value={hour} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Minuto */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Minuto</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{minute2}</Text>
                  <Picker
                    selectedValue={minute2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setMinute2(itemValue)}
                  >
                    {[...Array(60).keys()].map((minute) => (
                      <Picker.Item key={minute} label={minute.toString().padStart(2, '0')} value={minute} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Segundo */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Segundo</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{second2}</Text>
                  <Picker
                    selectedValue={second2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSecond2(itemValue)}
                  >
                    {[...Array(60).keys()].map((second) => (
                      <Picker.Item key={second} label={second.toString().padStart(2, '0')} value={second} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
            </View>
      
 
      <View style={styles.buttonContainer}>
        <Button title="Enviar Datos" color="#FFD700" onPress={enviarDatos} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Recibir Datos" color="#FFD700" onPress={recibirDatos} />
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginLeft: 115,
    marginTop: -50,
    marginBotton: 100,
    alignItems: 'center',
  },
 
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    alignItems: 'center',
  },
  pickerLabelContainer: {
    alignItems: 'center',
    width: 100,
  },
  pickerLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: 35,
    borderWidth: 1,
    textAlign: 'flex-end',
    alignItems: 'flex-end',
    borderColor: '#FFD700', // Amarillo
    borderRadius: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30
  },
  selectedValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
 
export default FourthScreen;