import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const unsub = navigationListener();
    loadAlerts();
    return unsub;
  }, []);

  const navigationListener = () => {
    // placeholder para futuro: recargar cada vez que se visite pantalla
    return () => {};
  };

  const loadAlerts = async () => {
    const data = await AsyncStorage.getItem('alerts');
    if (data) setAlerts(JSON.parse(data));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={(item,index)=>index.toString()}
        renderItem={({item})=>(
          <View style={styles.item}>
            <Text style={styles.msg}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay alertas aún.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:'#fff' },
  item:{ padding:10, borderBottomWidth:1, borderColor:'#eee' },
  msg:{ fontSize:16 },
  time:{ fontSize:12, color:'#666' }
});