import { ActivityIndicator, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

// my API = 4665dfc8b15c84ec4910a9138fa49893
const URL = 'https://api.openweathermap.org/data/2.5/weather?lat=17.38405&lon=78.45636&appid=4665dfc8b15c84ec4910a9138fa49893'

const Weather = () => {

  const [weather,setWeather] = useState();

  const fetchWeather = async () => {
    const res = await fetch(URL);
    const data = await res.json();
    // console.log(JSON.stringify(data,null,2));
    setWeather(data);
  }
  useEffect(()=>{
    fetchWeather();
  },[])

  if(!weather){
    return <ActivityIndicator />
  }

  return (
    <View>
      <Text>{weather.name}</Text>
    </View>
  )
}

export default Weather;