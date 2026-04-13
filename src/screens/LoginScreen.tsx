import { StyleSheet, Text, View , TextInput, Image,TouchableOpacity } from 'react-native'
import React from 'react'

const LoginScreen = () => {
  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
         <Text style={styles.headerText}> Welcome to Calmi</Text>
        </View>
     <View style={styles.imgContainer}>
        <Image source={require('../assets/images/sadKoala.jpg')} style={styles.img}/>
        <Image source={require('../assets/images/happykoala.jpg')} style={styles.img}/>
        <Image source={require('../assets/images/annoyedKoala.jpg')} style={styles.img}/>
     </View>

     <View style={styles.textInputContainer}>
        <TextInput placeholder='Username' style={{borderWidth: 1, borderColor: '#8B9DFE', borderRadius: 10, paddingHorizontal: 10, width: '100%', marginBottom: 20}}/>
        <TextInput placeholder='Password'  secureTextEntry style={{borderWidth: 1, borderColor: '#8B9DFE', borderRadius: 10, paddingHorizontal: 10, width: '100%', marginBottom: 20}}/>

     </View>
     <View>
        <Text style={styles.continue}> Or Continue with...</Text>
     </View>

     {/* <TouchableOpacity style={styles.loginMethod}>
        <Text>Google</Text>
     </TouchableOpacity>
      */}
     



    
    </View> 
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20
    },
    imgContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        marginBottom: 50
    },
    img:{
        width: 100,
        height: 120,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
    },
    headerContainer:{
        marginTop: 60,
        alignItems: 'center',
    },
    headerText:{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#8B9DFE',
    },
    textInputContainer:{
        width: '90%',
        height:120
    },
    continue:{
        fontSize: 16,
        color: '#8B9DFE',
        fontWeight: 'bold',
        marginBottom: 30
    },   
    
})
