import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation, userEmail, expoPushToken }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userEmail');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido, {userEmail}</Text>
      <View style={styles.btn}>
        <Button title="Vigilar bebé" onPress={() => navigation.navigate('Vigilance')} />
      </View>
      <View style={styles.btn}>
        <Button title="Registro de actividades" onPress={() => navigation.navigate('Activities')} />
      </View>
      <View style={styles.btn}>
        <Button title="Alertas" onPress={() => navigation.navigate('Alerts')} />
      </View>
      <View style={styles.btn}>
        <Button title="Ajustes" onPress={() => navigation.navigate('Settings')} />
      </View>
      <View style={styles.btn}>
        <Button title="Cerrar sesión" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', padding:20, backgroundColor:'#fff' },
  welcome:{ fontSize:18, marginBottom:20, textAlign:'center' },
  btn:{ marginBottom:12 }
});