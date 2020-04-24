import React from 'react';
import { Text, View, FlatList, Image, Alert, TouchableOpacity } from 'react-native';
import TrackItem from './subComponents/TrackItem';
import YoutubePlayer from './subComponents/YoutubePlayer';
import firebase from '../../firebase';
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native'
import { WebView } from 'react-native-webview';



export class PartyView extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            listLoaded: false,
            activeVideo: 'qSRrxpdMpVc',
            partyId: props.route.params.partyId,
            party: {
                joinId: '',
                partyName: '',
                condition: '',
                playlist: ''
            }
        };
        console.log("Created partyView with partyId:", props.route.params.partyId)
    }

    bindPartyChangesFromDB = async () => {
        const db = firebase.firestore();
        try {
            const DBbindingResponse = await db.collection('party').doc(this.state.partyId).onSnapshot(snapshot => {
                const data = snapshot.data();
                this.setState({
                    party: {
                        joinId: data.joinId,
                        partyName: data.name,
                        condition: data.condition,
                        playlist: data.playlist
                    }
                });
                console.log('onSnapshot change-->', data.name, data.condition);
            })

            // TODO - when distructing component --> call DBbindingResponse() to unbind it from DB
        } catch (error) {
            console.log('bindParty changes From DB error', error)
            Alert.alert(`Error getting updates from party #${this.state.party.joinId}`);
        }


    }

    async componentDidMount() {
        try {
            // bind party continues updates from DB to this component
            await this.bindPartyChangesFromDB()

            // fetch videos from youtube
            const response = await fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=mountain+bike&type=video&key=AIzaSyAupliSgIaeUYlInVoB8PSqxX1CSerpkaY')
            const responseJson = await response.json()
            this.setState({
                listLoaded: true,
                videoList: Array.from(responseJson.items)
            })
        } catch (error) {
            console.log(error);
        }
    }

    loadVideoToPlayer = (id) => {
        console.log('video id', id)
        this.setState({
            activeVideo: id
        })
    }

    onPressPlayPause = async () => {
        const db = firebase.firestore();
        try {
            const newCondition = this.state.party.condition === 'play' ? 'pause' : 'play'
            await db.collection('party').doc(this.state.partyId).update({ condition: newCondition })
            const updatedParty = this.state.party
            updatedParty.condition = newCondition
            // this.setState({
            // party: updatedParty
            // })
        }
        catch (error) {
            console.log(error)
        }
    }

    onPressLeaveParty = () =>
        Alert.alert(
            'Leaving so soon?',
            'Are you sure you want to leave this party?',
            [
                {
                    text: 'Leave',
                    onPress: () => this.props.navigation.dispatch(StackActions.popToTop())
                },
                {
                    text: 'Stay',
                    onPress: () => { }
                }
            ]
        );



    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
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

                {/* renders the WebView component */}
                <View style={{ flex: 2 }}>
                    <YoutubePlayer videoId={this.state.activeVideo} />
                </View>

                <View style={{ flex: 3, paddingTop: 30 }}>
                    {this.state.listLoaded && (
                        <FlatList
                            data={this.state.videoList}
                            renderItem={({ item }) =>
                                <TrackItem
                                    key={item.id.videoId}
                                    id={item.id.videoId}
                                    title={item.snippet.title}
                                    imageSrc={item.snippet.thumbnails.high.url}
                                    loadVideoFunc={this.loadVideoToPlayer}
                                />
                            }
                            keyExtractor={item => item.id.videoId}
                        />
                    )}

                    {!this.state.listLoaded && (
                        <Text> LOADING </Text>
                    )}
                </View>

            </View>
        )
    }
}