import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default function ActivitiesScreen() {
  const [title, setTitle] = useState('');
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const data = await AsyncStorage.getItem('activities');
    if (data) setActivities(JSON.parse(data));
  };

  const addActivity = async () => {
    if (!title) return;
    const newAct = { title, time: moment().format('YYYY-MM-DD HH:mm') };
    const updated = [newAct, ...activities];
    setActivities(updated);
    await AsyncStorage.setItem('activities', JSON.stringify(updated));
    setTitle('');
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Actividad (ej. Durmió, Comió)" value={title} onChangeText={setTitle} style={styles.input}/>
      <Button title="Agregar" onPress={addActivity}/>
      <FlatList
        data={activities}
        keyExtractor={(item,index)=>index.toString()}
        renderItem={({item})=>(
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:'#fff' },
  input:{ borderWidth:1, borderRadius:5, marginBottom:10, padding:10, borderColor:'#ddd' },
  item:{ padding:10, borderBottomWidth:1, borderColor:'#eee' },
  title:{ fontSize:16 },
  time:{ fontSize:12, color:'#666' }
});