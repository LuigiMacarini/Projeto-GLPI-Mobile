// Accordion para a aba de TI
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const Accordion = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.alt}>{isExpanded ? '-' : '+'}</Text>
      </Pressable>
      {isExpanded && <Animatable.View 
       animation={"fadeInUp"}
      style={styles.content}>{children}</Animatable.View>}
    </View>
  );
  
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    margin: 12

  },
  header: {
    backgroundColor: '#498DF3',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius:10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#fff",
  },
  alt: {
    fontSize: 16,
    color: "#fff"
    
  },
  content: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    
  },
});

export default Accordion;
