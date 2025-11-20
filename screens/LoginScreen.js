import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, setUserEmail }) {
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    if (!email) return alert('Ingrese su correo');
    await AsyncStorage.setItem('userEmail', email);
    setUserEmail(email);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Text style={styles.title}>BabyApp 2.0</Text>
      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.btn}>
        <Button title="Ingresar" onPress={handleLogin} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20, backgroundColor:'#fff' },
  title: { fontSize:28, marginBottom:20, fontWeight:'600' },
  input: { width:'100%', borderWidth:1, padding:12, marginBottom:20, borderRadius:8, borderColor:'#ddd' },
  btn: { width:'100%' }
});