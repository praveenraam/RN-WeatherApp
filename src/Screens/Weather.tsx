import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, PermissionsAndroid, Platform, Alert } from 'react-native';
import GetLocation from 'react-native-get-location';

const api = `api`
const BASE_URL = `https://${api}.openweathermap.org/data/2.5/`;
// const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;
const OPEN_WEATHER_KEY = `4665dfc8b15c84ec4910a9138fa49893`;

type Weather = {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
};

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location to show weather information.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            fetchLocation();
          } else {
            Alert.alert('Permission Denied', 'Location permission is required to fetch weather data.');
          }
        } catch (err) {
          Alert.alert(err);
        }
      } else {
        fetchLocation();
      }
    };

    requestLocationPermission();
  }, [location]);

  const fetchLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
    .then(location => {
      setLocation(location);
      fetchWeather(location);
    })
    .catch(error => {
      const { code } = error;
      if (code === 'UNAUTHORIZED') {
        Alert.alert('Permission Denied', 'Please enable location services in your device settings.');
      }
    });
  };

  const fetchWeather = async (location) => {
    if(!location) return;

    const { latitude, longitude } = location;
    try {
      const res = await fetch(`${BASE_URL}weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_KEY}&metric=units`);
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      Alert.alert('Error fetching weather data:', error);
    }
  };


  if (!weather) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.location}>{weather.name}</Text>
      <Text style={styles.temp}>{Math.round(weather.coord.lon)}°C</Text>
      <Text >{weather.coord.lon}°C</Text>
      <Text >{weather.coord.lat}°C</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 20, 
  },
  location: {
    fontFamily:'Inter',
    fontSize: 30,
    color: 'black',
    marginBottom: 10,
  },
  temp: {
    fontFamily:'InterBlack',
    fontSize: 100,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default Weather;
