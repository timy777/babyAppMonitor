import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VigilanceScreen({ navigation, userEmail, expoPushToken }) {
  const cameraRef = useRef(null);
  const recordingRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [listening, setListening] = useState(false);
  const [lastAlert, setLastAlert] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const audioStatus = await Audio.requestPermissionsAsync();
      setHasPermission(cameraStatus === 'granted' && audioStatus.status === 'granted');
    })();
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, staysActiveInBackground: true });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setListening(true);

      // check status cada 1.5s
      recording.setOnRecordingStatusUpdate(status => {
        // status.metering no está garantizado; usamos duration como heurística y getURI fallback
      });

      const interval = setInterval(async () => {
        try {
          if (!recordingRef.current) return;
          const status = await recordingRef.current.getStatusAsync();
          // Simulación simple: si el nivel de sampleSize (approx) es alto consideramos llanto.
          // Muchos dispositivos no entregan metering; por eso usamos duration como simple trigger de prueba
          if (status && status.durationMillis && status.durationMillis % 5000 < 200) {
            // no es un detector real, solo demostración de alerta
            const now = new Date().toISOString();
            // evitar alertas continuas: cada 15s como mínimo
            if (!lastAlert || (new Date() - new Date(lastAlert) > 15000)) {
              setLastAlert(now);
              Alert.alert('Alerta', '¡Llanto detectado (simulado)!');
              saveAlertLocal('Llanto detectado', now);
              // enviar push al token guardado (el expoPushToken o token asociado)
              const associatedToken = await AsyncStorage.getItem('associatedToken');
              const tokenToSend = associatedToken || expoPushToken;
              if (tokenToSend) sendPushNotification(tokenToSend);
            }
          }
        } catch (e) {
          console.log('error status recording', e);
        }
      }, 1500);

      // attach interval id to ref to clear later
      recordingRef.current._checkInterval = interval;
    } catch (e) {
      console.log('Error startRecording', e);
    }
  };

  const stopRecording = async () => {
    try {
      if (recordingRef.current) {
        if (recordingRef.current._checkInterval) clearInterval(recordingRef.current._checkInterval);
        const r = recordingRef.current;
        recordingRef.current = null;
        try { await r.stopAndUnloadAsync(); } catch (e) { /* ignore */ }
      }
      setListening(false);
    } catch (e) {
      console.log('Error stopping recording', e);
    }
  };

  const toggleListening = () => {
    if (listening) stopRecording();
    else startRecording();
  };

  const saveAlertLocal = async (message, time) => {
    try {
      const a = await AsyncStorage.getItem('alerts');
      const alerts = a ? JSON.parse(a) : [];
      alerts.unshift({ message, time });
      await AsyncStorage.setItem('alerts', JSON.stringify(alerts));
    } catch (e) {
      console.log('saveAlertLocal', e);
    }
  };

  const sendPushNotification = async (token) => {
    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method:'POST',
        headers:{ 'Accept':'application/json','Content-Type':'application/json' },
        body: JSON.stringify({
          to: token,
          title: 'BabyApp 2.0',
          body: 'Llanto de bebé detectado!',
        })
      });
    } catch (e) {
      console.log('sendPushNotification error', e);
    }
  };

  if (hasPermission === null) return <View style={styles.center}><Text>Solicitando permisos...</Text></View>;
  if (hasPermission === false) return <View style={styles.center}><Text>Permiso denegado</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} ref={cameraRef} ratio="16:9" />
      </View>
      <View style={styles.controls}>
        <Button title={listening ? "Detener escucha" : "Iniciar escucha"} onPress={toggleListening} />
        <View style={{ height:10 }} />
        <Button title="Volver" onPress={() => { stopRecording(); navigation.goBack(); }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff' },
  cameraContainer:{ flex:1, backgroundColor:'#000' },
  camera:{ flex:1 },
  controls:{ padding:16 },
  center:{ flex:1, justifyContent:'center', alignItems:'center' }
});