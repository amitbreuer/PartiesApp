import React from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import { PartyView } from '../PartyView.js'
import SetPartyView from '../SetPartyView.js'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { HomeTab } from '../../tabs/HomeTab.js'
import { BackButtonHandler } from './AndroidBackHandler.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import PartyTimeTab from '../../tabs/PartyTimeTab.js'
import AddToPlaylistView from '../AddToPlaylistView.js'
import { LoginView } from '../LogjnView.js'
import MainTabsView from '../MainTabsView.js'

const Stack = createStackNavigator();

export default class Navigator extends React.Component {

    createMainStack = () => {
        console.log(LoginView);
        return <Stack.Navigator
            screenOptions={{
                gestureEnabled: false
            }}
            headerMode='none'>
            <Stack.Screen name="Bottom Tabs" component={MainTabsView} />
            <Stack.Screen name="Login" component={LoginView} />
            {/* <Stack.Screen name="Bottom Tabs" component={MainTabsView} /> */}
        </Stack.Navigator>
    }

    // createBottomTabs = () => {
    //     return <Tab.Navigator>
    //         <Tab.Screen name="Home Tab" component={HomeTab}
    //             options={{
    //                 tabBarLabel: 'Home',
    //                 tabBarIcon: ({ color }) => (
    //                     <MaterialCommunityIcons name="home" color={color} size={30} />),
    //             }}
    //         />
    //         <Tab.Screen name="New Party Tab" component={this.createPartyStack} initialParams={{ isNewParty: true }}
    //             options={{
    //                 tabBarLabel: 'New Party',
    //                 tabBarIcon: ({ color }) => (
    //                     <MaterialCommunityIcons name="music" color={color} size={30} />),
    //             }}
    //         />
    //         <Tab.Screen name="Join Party Tab" component={this.createPartyStack} initialParams={{ isNewParty: false }}
    //             options={{
    //                 tabBarLabel: 'Join Party',
    //                 tabBarIcon: ({ color }) => (
    //                     <MaterialCommunityIcons name="music" color={color} size={30} />),
    //             }}
    //         />
    //         <Tab.Screen
    //             name="Party Time Tab"
    //             component={this.createPartyTabStack}
    //             options={{
    //                 tabBarLabel: 'Party Time',
    //                 tabBarIcon: ({ color }) => (
    //                     <MaterialCommunityIcons name="music" color={color} size={30} />),
    //             }}
    //             listeners={({ navigation, route }) => ({
    //                 tabPress: e => {
    //                     e.preventDefault();
    //                     navigation.navigate('Party Time Tab');
    //                 },
    //             })}
    //         />
    //     </Tab.Navigator>
    // }

    // createPartyTabStack = () => {
    //     return (
    //         <Stack.Navigator
    //             screenOptions={{
    //                 gestureEnabled: false
    //             }}
    //             headerMode='none'
    //         >
    //             <Stack.Screen
    //                 name="Party Time"
    //                 component={PartyTimeTab}
    //             />
    //             <Stack.Screen
    //                 name="Set Party"
    //                 component={SetPartyView}
    //             />
    //             <Stack.Screen
    //                 name="Party View"
    //                 component={PartyView}
    //             />
    //             <Stack.Screen
    //                 name="Add To Playlist"
    //                 component={AddToPlaylistView}
    //             />
    //         </Stack.Navigator >
    //     )
    // }

    // createPartyStack = ({ route }) => {
    //     return (
    //         <Stack.Navigator
    //             screenOptions={{
    //                 gestureEnabled: false
    //             }}
    //             headerMode='none'
    //         >
    //             <Stack.Screen
    //                 name="Set Party"
    //                 component={SetPartyView}
    //                 initialParams={{ isNewParty: route.params.isNewParty }}
    //             />
    //             <Stack.Screen
    //                 name="Party View"
    //                 component={PartyView}
    //             />
    //             <Stack.Screen
    //                 name="Add To Playlist"
    //                 component={AddToPlaylistView}
    //             />
    //         </Stack.Navigator>
    //     )
    // }

    render() {
        return (
            <NavigationContainer>
                {/* <BackButtonHandler/>  */}
                {this.createMainStack()}
            </NavigationContainer>
        )
    }
}