import React from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import { PartyView } from '../PartyView.js'
import SetPartyView from '../SetPartyView.js'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import HomeTab from '../../tabs/HomeTab.js'
import { BackButtonHandler } from './AndroidBackHandler.js'
import GoParty from '../GoPartyView.js'
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Stack = createStackNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();

export default class Navigator extends React.Component {
    createStack = () => {
    return (
        <Stack.Navigator>
        <Stack.Screen 
        name="Bottom Tabs" 
        component={this.createBottomTabs}
        options={{
            title: "",
        }}
        />
        </Stack.Navigator> 
        )
    }

    createBottomTabs = (props) => {
    return <MaterialBottomTabs.Navigator>
        <MaterialBottomTabs.Screen
        name="Tab 1"
        style={{ marginBottom: 16 }}
        component={HomeTab}
        options={{
            tabBarLabel: 'Home',
            
        }}
        />
        <MaterialBottomTabs.Screen name="Tab 2" component={this.createPartyStack} initialParams={{isNewParty:true}}
        options={{
            tabBarLabel: 'New Party',
            
        }}
        />
        <MaterialBottomTabs.Screen name="Tab 3" component={this.createPartyStack} initialParams={{isNewParty:false}}
        options={{
            tabBarLabel: 'Join Party',
            
        }}
        />
        <MaterialBottomTabs.Screen name="Tab 4" component={this.createPartyTabStack}
          options={{
            tabBarLabel: 'Go Party',
            
        }}
        />
    </MaterialBottomTabs.Navigator>
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
                name="Go Party"
                component={GoParty}
            />
            <Stack.Screen
                name="Set Party"
                component={SetPartyView}
                //initialParams={{isNewParty: route.params.isNewParty}}
            />
            <Stack.Screen
                name="Party View"
                component={PartyView}
            />
            </Stack.Navigator>
            )
    }

    createPartyStack = ({ navigation,route }) => {
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
            initialParams={{isNewParty: route.params.isNewParty}}
        />
        <Stack.Screen
            name="Party View"
            component={PartyView}
        />
        </Stack.Navigator>
        )
    }

    render() {
        return(
            <NavigationContainer>
                <BackButtonHandler/> 
                {this.createStack()}
            </NavigationContainer>
        )
    }
}