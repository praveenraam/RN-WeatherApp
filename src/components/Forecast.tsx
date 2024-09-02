import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { WeatherForecast } from '../Screens/Weather'
import dayjs from 'dayjs';

const Forecast = ({forecast}: {forecast:WeatherForecast} ) => {
  return (
    <View style={styles.container}>
      <Text style={styles.temp}>{Math.floor(forecast.main.temp)}°C</Text>
      <Text style={styles.date}>{dayjs.unix(forecast.dt).format('HH h a')}</Text>
    </View>
  )
}

export default Forecast

const styles = StyleSheet.create({
  container:{
    backgroundColor:'ghostwhite',
    marginTop:10,
    padding: 10,
    aspectRatio: 9/16,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
  },
  temp:{
    fontFamily:'InterBold',
    fontSize:30,
    color:'grey',
    marginVertical:10,
  },
  date:{
    fontFamily:'InterSemi',
    fontSize:16,
    fontWeight:'bold',
    color:'#000',
  }
})