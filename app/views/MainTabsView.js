import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { HomeTab } from '../tabs/HomeTab.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import PartyTimeTab from '../tabs/PartyTimeTab.js'
import AddToPlaylistView from './AddToPlaylistView.js'
import { PartyView } from './PartyView.js'
import SetPartyView from './SetPartyView.js'

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();


export class MainTabsView extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    createBottomTabs = () => {
        return <Tab.Navigator>
            <Tab.Screen name="Home Tab" component={HomeTab}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={30} />),
                }}
            />
            <Tab.Screen name="New Party Tab" component={this.createPartyStack} initialParams={{ isNewParty: true }}
                options={{
                    tabBarLabel: 'New Party',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="music" color={color} size={30} />),
                }}
            />
            <Tab.Screen name="Join Party Tab" component={this.createPartyStack} initialParams={{ isNewParty: false }}
                options={{
                    tabBarLabel: 'Join Party',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="music" color={color} size={30} />),
                }}
            />
            <Tab.Screen
                name="Party Time Tab"
                component={this.createPartyTabStack}
                options={{
                    tabBarLabel: 'Party Time',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="music" color={color} size={30} />),
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        e.preventDefault();
                        navigation.navigate('Party Time Tab');
                    },
                })}
            />
        </Tab.Navigator>
    }

    createPartyTabStack = () => {
        return (
            <Stack.Navigator
                screenOptions={{
                    gestureEnabled: false
                }}
                headerMode='none'
            >
                <Stack.Screen
                    name="Party Time"
                    component={PartyTimeTab}
                />
                <Stack.Screen
                    name="Set Party"
                    component={SetPartyView}
                />
                <Stack.Screen
                    name="Party View"
                    component={PartyView}
                />
                <Stack.Screen
                    name="Add To Playlist"
                    component={AddToPlaylistView}
                />
            </Stack.Navigator >
        )
    }

    createPartyStack = ({ route }) => {
        return (
            <Stack.Navigator
                screenOptions={{
                    gestureEnabled: false
                }}
                headerMode='none'
            >
                <Stack.Screen
                    name="Set Party"
                    component={SetPartyView}
                    initialParams={{ isNewParty: route.params.isNewParty }}
                />
                <Stack.Screen
                    name="Party View"
                    component={PartyView}
                />
                <Stack.Screen
                    name="Add To Playlist"
                    component={AddToPlaylistView}
                />
            </Stack.Navigator>
        )
    }


    render() {
        return (
            <View>
                {this.createBottomTabs()}
            </View>
        )
    }
}

