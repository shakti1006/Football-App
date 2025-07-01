import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Animated,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { StackActions } from '@react-navigation/native';

export default function SplashScreen({ navigation }) {

  useEffect(() => {
    // Navigate to user list after 3s
    const timer = setTimeout(() => {
      navigation.dispatch(StackActions.replace('Home'));
    }, 3000);
    return () => clearTimeout(timer);
  }, [ navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={require('../images/splash.jpg')}  // swap in your own splash image
        style={styles.background}
        resizeMode="cover"
      >
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#ffffff'
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  loadingText: {
    color: 'blue',
    marginTop: 20,
    fontSize: 40,
  },
});
