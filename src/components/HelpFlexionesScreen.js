import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const HelpFlexionesScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen de animación */}
      <Image
        source={require('../../assets/imagenAyuda.png')} // Reemplaza con tu imagen de animación
        style={styles.animationImage}
      />

      {/* Instrucciones */}
      <Text style={styles.title} >Instrucciones para usar la Maquina de Flexiones</Text>

      <Text style={styles.instructionText}>
        1. Coloca tu muestra en la maquina, asegurandote que esté bien fijada.
      </Text>

      <Text style={styles.instructionText}>
        2. Coloca el indicador de posición en 0 grados.
      </Text>

      <Text style={styles.instructionText}>
        3. Una vez que te asegures que la muestra se encuentra en 0 grados, ya puedes conectar la maquina a la energía eléctrica.
      </Text>

      <Text style={styles.instructionText}>
        4. Conectate a la señal wifi llamada "ITK-Servidor". Contraseña: atazavcan
      </Text>

      <Text style={styles.instructionText}>
        5. Abre la app y selecciona "Maquina Flexiones" del menú principal.
      </Text>

      <Text style={styles.instructionText}>
        6. Espera a que te salga la alerta de "conectado al servidor" y presion "ok".
      </Text>

      {/* Más instrucciones o contenido adicional */}
      <Text style={styles.additionalText}>
        7. Ingresa la cantidad de ciclos para tu prueba.
      </Text>

      <Text style={styles.additionalText}>
        8. Ingresa los angulos 1 de tu prueba (desde la posicion inicial en 0 grados hasta el extremo deseado)
      </Text>

      <Text style={styles.additionalText}>
        9. Ingresa los angulos 2 de tu prueba (desde la posicion inicial en 0 grados hasta el otro extremo deseado)
      </Text>

      <Text style={styles.additionalText}>
        10. Presionar "INICIAR NUEVA PRUEBA" para iniciar la prueba.
      </Text>

      <Text style={styles.additionalText}>
        11. Ajustar manualmente el flujo de aire para la velcodiad de flexion.
      </Text>

      <Text style={styles.additionalText}>
        12. Presionar "VISUALIZAR DATOS" para ver los datos de la prueba en curso. (Puede tardar hasta 2 segundos en obtener los datos)
      </Text>

      <Text style={styles.additionalText}>
        -Ciclos transcurridos: Numero de ciclos que la muestra ha realizado.
      </Text>

      <Text style={styles.additionalText}>
        -Estado de prueba: Muestra si la prueba está en curso, pausada o finalizada.
      </Text>

      <Text style={styles.additionalText}>
        -Tiempo transcurrido: Muestra el tiempo  en minutos que la muestra ha estado en funcionamiento.
      </Text>

      <Text style={styles.additionalText}>
        13. Presionar "PAUSAR PRUEBA" para parar la prueba momentaneamente. 
      </Text>

      <Text style={styles.additionalText}>
        14. Presionar "REANUDAR PRUEBA" para continuar con la prueba que fue pausada anteriormente. 
      </Text>

      <Text style={styles.additionalText}>
        15. Una vez iniciada la prueba y verificar su correcto funcionameinto, puedes cerrar la app y conectarte a otra red WIFI si lo deseas. 
      </Text>

      <Text style={styles.additionalText}>
        16. En cualquier momento puedes conectarte a la red WIFI y entrar a la appp para ver los datos de la prueba en curso.
      </Text>

      <Text style={styles.additionalText}>
        17. Cuando se acompleten los ciclos establecidos la prueba se parará autoameticamente.
      </Text>

      <Text style={styles.additionalText}>
        18. Desconecta todo y deja la Maquina lista para que otro ingeniero la pueda ocupar.
      </Text>

      <Text style={styles.additionalText}>
        19. Cualquier incoveniente o idea de mejora comunicarse con los desarrolladores de la app.
      </Text>

      <Text style={styles.additionalText}>
        20. Más actualizaciones proximamente...
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

export default HelpFlexionesScreen;
