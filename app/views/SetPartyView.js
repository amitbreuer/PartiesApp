import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, Button, Keyboard, Switch } from 'react-native';
import PartyView from './PartyView'
import firebase from '../../firebase'
import DB_TABLES from '../../assets/utils'
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native'
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';

const userPermissions = { HOST: 'HOST', DJ: 'DJ', GUEST: 'GUEST' };
const partyModes = { VIEW_ONLY: 'VIEW ONLY', FRIENDLY: 'FRIENDLY'}

export default class SetPartyView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isNewParty: props.route.params.isNewParty,
            inputValue: '',
            loggedInUser: props.route.params.loggedInUser,
            isPublic: false,
            partyMode: ''
        }
    }

    getPlaylistId = async (playlist) => {
        const playlistResponse = await playlist.get();
        return playlistResponse.id;
    }

    getAttributes = (isNewParty) => {
        const db = firebase.firestore();
        let message, inputPlaceholder, buttonText, handleSetParty;
        if (isNewParty) {
            [message, inputPlaceholder, buttonText] = [
                'Please enter a name for your party',
                'Party name',
                'Start new party'
            ];
            handleSetParty = async (partyName) => {
                try {
                    const lastCreatedParty = await db.collection('party').orderBy('creationTime', 'desc').limit(1).get();
                    let joinId;
                    if (lastCreatedParty.docs[0]) {
                        const partyData = lastCreatedParty.docs[0].data();
                        joinId = partyData.joinId;
                        joinId++;
                    } else {
                        joinId = 100;
                    }
                    const playlistResponse = await db.collection('playlist').add({
                        tracks: []
                    });
                    const { id: playlistId } = playlistResponse;
                    const playlist = await db.doc(`/playlist/${playlistId}`);   // playlist Reference on DB

                    const loggedInUser = this.state.loggedInUser;
                    loggedInUser.permission = userPermissions.HOST;

                    const participants = [loggedInUser];
                    const isPublic = this.state.isPublic;
                    const partyMode = this.state.partyMode;
                    const currentTime = new Date();
                    const response = await db.collection('party').add({
                        joinId,
                        name: partyName || `Party #${joinId}`,
                        condition: 'pause',
                        playlist,
                        creationTime: currentTime,
                        activeVideoId: '',
                        currentTime: 0,
                        lastUpdatedTime: currentTime,
                        participants,
                        isPublic,
                        partyMode
                    });

                    const partyId = response.id;
                    this.props.navigation.navigate('Party Drawer', {
                        partyId,
                        isHost: true,
                        playlist: playlistId,
                        isInvited: false,
                        participants,
                        loggedInUser
                    });
                } catch (error) {
                    console.log(`Error starting new party ${error}`);
                    Alert.alert(`Error starting new party`);
                }
            };
        } else {    // join to existing party
            [message, inputPlaceholder, buttonText] = [
                'Please enter Party ID',
                'Party ID',
                'Join'
            ];
            handleSetParty = async (joinId) => {
                try {
                    const response = await db.collection('party').where('joinId', '==', parseInt(joinId)).limit(1).get();
                    const party = response.docs[0];
                    const partyId = party.id
                    const data = party.data();
                    const { name, participants, playlist, lastUpdatedTime, partyMode } = data;
                    const playlistId = await this.getPlaylistId(playlist);

                    const loggedInUser = this.state.loggedInUser;
                    loggedInUser.permission = partyMode === partyModes.FRIENDLY ? userPermissions.DJ : userPermissions.GUEST;       /////////////// determined by party mode

                    participants.push(loggedInUser)
                    await db.collection('party').doc(partyId).update({ participants });
                    Alert.alert(`Joining Party ${name}`);
                    this.props.navigation.navigate('Party Drawer', {
                        partyId,
                        isHost: false,
                        playlist: playlistId,
                        isInvited: false,
                        participants,
                        loggedInUser
                    });
                } catch (e) {
                    console.log('Error join existing party', e)
                    Alert.alert(`Could not load party with Join Id ${joinId}`)
                }
            };
        }
        return { message, inputPlaceholder, buttonText, handleSetParty };
    }

    render() {
        const { message, inputPlaceholder, buttonText, handleSetParty } = this.getAttributes(this.state.isNewParty);
        return (
            <View style={styles.center}>
                <View style={{...styles.center,flex:0.2}}>
                    <Text style={styles.title}>{message}</Text>
                    <TextInput style={styles.input} placeholder={inputPlaceholder}
                        onChangeText={inputValue => this.setState({ inputValue })}>
                    </TextInput>
                </View>
                {this.state.isNewParty &&
                    <View style={{ flex: 0.2 }}>
                        <View style={{ ...styles.row, ...styles.publicSwitch }}>
                            <Text>Public</Text>
                            <Switch
                                value={this.state.isPublic}
                                onValueChange={(isPublic) => this.setState({ isPublic })}
                                thumbColor={this.state.isPublic ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                trackColor={{ false: "#767577", true: "#ff7752" }}
                            />
                        </View>
                        <View style={styles.partyModePicker}>
                            <DropDownPicker
                                items={[
                                    { label: 'View Only', value: partyModes.VIEW_ONLY, icon: () => <Icon name="music" size={18} color="#900" /> },
                                    { label: 'Friendly', value: partyModes.FRIENDLY, icon: () => <Icon name="music" size={18} color="#900" /> },
                                ]}
                                placeholder="Select Party Mode "

                                containerStyle={{ height: 40, width: 180, marginTop: 10, marginBottom: 10 }}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                onChangeItem={item => this.setState({ partyMode: item.value })}
                            />
                        </View>
                    </View>
                }
                <View style={{ flex: 0.25,position: 'absolute',bottom:50 }}>
                    <Button
                        style={{ marginBottom: 30 }}
                        disabled={this.state.isNewParty && this.state.partyMode === ''}
                        onPress={() => {
                            Keyboard.dismiss();
                            handleSetParty(this.state.inputValue);
                        }}
                        title={buttonText}
                    />
                    <Button
                        onPress={() => this.props.navigation.dispatch(StackActions.popToTop())}
                        title="Cancel"
                        color="#d2691e"
                    />
                </View>
            </View>
        );
    }
}
