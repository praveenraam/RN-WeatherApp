import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, PermissionsAndroid, Platform, Alert, FlatList,ImageBackground, Image } from 'react-native';
import GetLocation from 'react-native-get-location';
import Forecast from '../components/Forecast';

const api = `api`
const BASE_URL = `https://${api}.openweathermap.org/data/2.5/`;
// const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;
const OPEN_WEATHER_KEY = `4665dfc8b15c84ec4910a9138fa49893`;
const IMAGE = 'https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-colors-of-mountains-after-sunset-free-image.jpeg?w=2210&quality=70'

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

type Weather = {
  name: string;
  main: MainWeather;
};

export type WeatherForecast = {
  main:MainWeather;
  dt : number;
}

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState<Weather>(null);
  const [forecast,setForecast] = useState<WeatherForecast[]>(null);

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
            fetchForecast(location);
          } else {
            Alert.alert('Permission Denied', 'Location permission is required to fetch weather data.');
          }
        } catch (err) {
          Alert.alert(err);
        }
      } else {
        fetchLocation();
        fetchForecast(location);
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
      const res = await fetch(`${BASE_URL}weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_KEY}&units=metric`);
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      Alert.alert('Error fetching weather data:', error);
    }
  };

  const fetchForecast = async(location) => {
    if(!location) return;

    const {latitude,longitude} = location;
    try{
      const res = await fetch(`${BASE_URL}forecast?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_KEY}&units=metric`);
      const data = await res.json();
      setForecast(data.list);
      // console.log(forecast);
    } catch (error) {
      Alert.alert('Error fetching weather data:', error);
    }
  }

  if (!weather) {
    return <ActivityIndicator />;
  }

  return (
    <ImageBackground source={{uri: IMAGE}} style={styles.container}>

      <View style={{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.5)'}} />
      <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
        <Text style={styles.location}>{weather.name}</Text>
        <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
      </View>
      <FlatList 
        style={styles.flatlistStyle}
        showsVerticalScrollIndicator={true}
        data={forecast} horizontal contentContainerStyle={{gap:10,}}
        renderItem={({ item }) => (
         <Forecast forecast={item} />
        )}
      />
    </ImageBackground>
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
    color: 'lightgray',
  },
  flatlistStyle:{
    flexGrow:0,
    height:200,
    margin:10,
  },
});

export default Weather;
