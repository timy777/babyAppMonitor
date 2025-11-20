import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ expoPushToken }) {
  const [myToken, setMyToken] = useState('');
  const [associated, setAssociated] = useState('');

  useEffect(() => {
    (async () => {
      const storedMy = await AsyncStorage.getItem('myPushToken');
      const storedAssoc = await AsyncStorage.getItem('associatedToken');
      if (storedMy) setMyToken(storedMy);
      if (storedAssoc) setAssociated(storedAssoc);
      if (expoPushToken && !storedMy) {
        setMyToken(expoPushToken);
        await AsyncStorage.setItem('myPushToken', expoPushToken);
      }
    })();
  }, [expoPushToken]);

  const saveAssociated = async () => {
    await AsyncStorage.setItem('associatedToken', associated);
    alert('Token asociado guardado');
  };

  const shareMyToken = async () => {
    try {
      await Share.share({ message: myToken });
    } catch (e) { /* ignore */ }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mi push token:</Text>
      <Text selectable>{myToken || 'No disponible aún'}</Text>
      <View style={{ height:12 }} />
      <Button title="Compartir mi token" onPress={shareMyToken} />
      <View style={{ height:20 }} />
      <Text style={styles.label}>Token del dispositivo asociado:</Text>
      <TextInput value={associated} onChangeText={setAssociated} style={styles.input} placeholder="Pega aquí el token" />
      <Button title="Guardar token asociado" onPress={saveAssociated} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:'#fff' },
  input:{ borderWidth:1, borderRadius:6, padding:10, borderColor:'#ddd', marginBottom:12 },
  label:{ fontWeight:'600', marginBottom:6 }
});