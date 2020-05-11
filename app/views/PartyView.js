import React from 'react';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import TrackItem from './subComponents/TrackItem';
import YoutubeView from './subComponents/YoutubeView';
import firebase from '../../firebase';
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native'
import { WebView } from 'react-native-webview';
import Playlist from './subComponents/Playlist.js'



export class PartyView extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            activeVideo: {
                id: '',
                currentTime: 0
            },
            partyId: props.route.params.partyId,
            party: {
                joinId: '',
                partyName: '',
                condition: '',
                playlist: ''
            },
            userId: props.route.params.userId,
            isHost: props.route.params.isHost,
            isActionMaker: false
        };
        this.loadVideoToPlayer = this.loadVideoToPlayer.bind(this);
        this.db = firebase.firestore();
    }

    bindPartyChangesFromDB = async () => {
        try {
            this.dbbindingResponse = await this.db.collection('party').doc(this.state.partyId).onSnapshot(snapshot => {
                const data = snapshot.data();
                this.setState({
                    party: {
                        joinId: data.joinId,
                        partyName: data.name,
                        condition: data.condition,
                        playlist: data.playlist,
                    },
                    activeVideo: {
                        id: data.activeVideoId,
                        currentTime: data.currentTime
                    }
                });

                // use it to update currentTime on Db when new user joins party

                // if (activeUsers.length !== this.state.activeUsers.length && this.state.isHost) {
                //     await this.updateCurrentTimeInDB();
                // }
                this.updateHost(data.activeUsers);
            })

            // TODO - when distructing component --> call DBbindingResponse() to unbind it from DB
        } catch (error) {
            console.log('bindParty changes From DB error', error)
            Alert.alert(`Error getting updates from party #${this.state.party.joinId}`);
        }
    }

    updateHost = (activeUsers) => {
        const isHost = activeUsers[0] === this.state.userId;
        if (isHost && !this.state.isHost) {
            Alert.alert(`You are now ${this.state.party.partyName} new host!`)
        }
        this.setState({
            isHost
        })
    }

    async componentDidMount() {
        try {
            // bind party continues updates from DB to this component
            await this.bindPartyChangesFromDB()
        } catch (error) {
            console.log(error);
        }
    }

    loadVideoToPlayer = async (item) => {
        const id = item.id
        console.log(id)
        // this.setState({
        //     activeVideo : {id: id, currentTime: 0}
        // })
        await this.db.collection('party').doc(this.state.partyId).update({ activeVideoId: id, currentTime: 0 });
    }

    updateCurrentTimeInDB = async (currentTime) => {
        await this.db.collection('party').doc(this.state.partyId).update({ currentTime: currentTime });
        this.setState({
            isActionMaker: false
        })
    }

    onPressPlayPause = async () => {
        try {
            const newCondition = this.state.party.condition === 'play' ? 'pause' : 'play'
            await this.db.collection('party').doc(this.state.partyId).update({ condition: newCondition })
            const updatedParty = this.state.party
            updatedParty.condition = newCondition
            this.setState({
                party: updatedParty,
                isActionMaker: true
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    onPressLeaveParty = () => {
        Alert.alert(
            'Leaving so soon?',
            'Are you sure you want to leave this party?',
            [
                {
                    text: 'Stay',
                    onPress: () => { }
                },
                {
                    text: 'Leave',
                    onPress: () => { this.leaveParty(); }
                }
            ]
        );
    }

    leaveParty = async () => {
        this.props.navigation.dispatch(StackActions.popToTop());

        try {
            const party = await this.db.collection('party').doc(this.state.partyId).get();
            let { activeUsers } = party.data();

            this.dbbindingResponse();           // unbind party changes from DB for this component
            if (activeUsers.length === 1) {     // if last user - delete party
                const response = await this.db.collection('party').doc(this.state.partyId).delete();
                Alert.alert(`Party ${this.state.party.partyName} is closed for no active users`);
            } else {    // update active users
                activeUsers = activeUsers.filter(userId => userId !== this.state.userId);
                await this.db.collection('party').doc(this.state.partyId).update({ activeUsers });
            }
        } catch (error) {
            console.log(`Error on leave party ${error}`);
            Alert.alert(`Error on leave party`);
        }
    }


    render() {
        return (

            <View style={{ flex: 1 }}>
                <View style={{ flex: 2 }}>
                    <YoutubeView
                        activeVideo={this.state.activeVideo}
                        condition={this.state.party.condition}
                        updateCurrentTimeInDB={this.updateCurrentTimeInDB}
                        isHost={this.state.isHost}
                        isActionMaker={this.state.isActionMaker}
                    />
                </View>

                <View style={{
                    flexDirection: "row"
                }}>
                    <Text style={styles.partyStat}>{`ID: ${this.state.party.joinId}`}</Text>
                    <Text style={styles.partyStat}>{this.state.party.condition === 'play' ? 'PLAYING' : 'PAUESED'}</Text>
                    <TouchableOpacity onPress={this.onPressPlayPause}>
                        <Text style={styles.partyStat}>{'Play / Pause'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onPressLeaveParty}>
                        <Text style={styles.partyStat}>Leave</Text>
                    </TouchableOpacity>
                </View>

                <Playlist loadVideoToPlayer={this.loadVideoToPlayer} navigation={this.props.navigation} />

            </View>
        )
    }
}