import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const HelpCalentamientoScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen de animación */}
    <Image
        source={require('../../assets/imagenAyuda.png')} // Reemplaza con tu imagen de animación
        style={styles.animationImage}
      />

      {/* Instrucciones */}
      <Text style={styles.title} >Instrucciones para usar la Maquina de Calentamiento</Text>

      <Text style={styles.instructionText}>
        1. Coloca tu muestra en la maquina, asegurandote que esté bien fijada y que colocaste el fudible indicado correctamente.
      </Text>

      <Text style={styles.instructionText}>
        2. Una vez verificado que la conexión está bien realizada, procede a conectar el sistema de potencia y de control.
      </Text>

      <Text style={styles.instructionText}>
        3. Conectate a la señal wifi llamada "ITK-Servidor". Contraseña: atazavcan
      </Text>

      <Text style={styles.instructionText}>
        4. Abre la app y selecciona "Maquina Calentamiento" del menú principal.
      </Text>

      <Text style={styles.instructionText}>
        5. Espera a que te salga la alerta de "conectado al servidor" y presion "ok".
      </Text>

      {/* Más instrucciones o contenido adicional */}
      <Text style={styles.additionalText}>
        6. Ingresa la cantidad de ciclos para tu prueba.
      </Text>

      <Text style={styles.additionalText}>
        7. Ingresa el tiempo de encendido por cada ciclo en el apartado "TIEMPO DE ENCENDIDO"
      </Text>

      <Text style={styles.additionalText}>
        8. Ingresa el tiempo de APAGADO por cada ciclo en el apartado "TIEMPO DE APAGADO"
      </Text>

      <Text style={styles.additionalText}>
        9. Presionar "ENVIAR DATOS" para iniciar la prueba.
      </Text>

      <Text style={styles.additionalText}>
        10. Presionar "RECIBIR DATOS" para visualizar los datos de la prueba en curso. (Puede tardar hasta 2 segundos en obtener los datos).
      </Text>

      <Text style={styles.additionalText}>
        -sensor_value: Corriente que se está suministradno a la prueba.
      </Text>

      <Text style={styles.additionalText}>
        -Estado_ssr : Indica si la maquina se encuentra calentando la muestra o si está apagada en ese momento.
      </Text>

      <Text style={styles.additionalText}>
        -conteo_ciclos: Numero de diclos que se han realizado.
      </Text>

      <Text style={styles.additionalText}>
        -tiempo_transcurrido: Tiempo que la prueba ha estado en funcionamiento.
      </Text>

      <Text style={styles.additionalText}>
        11. Presionar "PAUSAR PRUEBA" para parar la prueba momentaneamente. 
      </Text>

      <Text style={styles.additionalText}>
        12. Presionar "REANUDAR PRUEBA" para continuar con la prueba que fue pausada anteriormente. 
      </Text>

      <Text style={styles.additionalText}>
        13. Una vez iniciada la prueba y verificar su correcto funcionameinto, puedes cerrar la app y conectarte a otra red WIFI si lo deseas. 
      </Text>

      <Text style={styles.additionalText}>
        14. En cualquier momento puedes conectarte a la red WIFI y entrar a la appp para ver los datos de la prueba en curso.
      </Text>

      <Text style={styles.additionalText}>
        15. Cuando se acompleten los ciclos establecidos la prueba se parará autoameticamente.
      </Text>

      <Text style={styles.additionalText}>
        16. Desconecta todo y deja la Maquina lista para que otro ingeniero la pueda ocupar.
      </Text>

      <Text style={styles.additionalText}>
        17. Cualquier incoveniente o idea de mejora comunicarse con los desarrolladores de la app.
      </Text>

      <Text style={styles.additionalText}>
        18. Más actualizaciones proximamente...
      </Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  animationImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFD700',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    marginVertical: 10,
    lineHeight: 24,
  },
  additionalText: {
    fontSize: 16,
    marginVertical: 10,
    lineHeight: 24,
    color: '#555',
  },
});

export default HelpCalentamientoScreen;
