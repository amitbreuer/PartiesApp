import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { styles } from '../../styles/styles.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class TrackItem extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            togglingMode: props.togglingMode || false,
            selected: false,
            editableMode: props.editableMode
        };
    }

    toggleItemSelection() {
        if (this.state.togglingMode) {
            this.setState(prevState => ({
                selected: !prevState.selected
            }));
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.onClickFunc(this.props.item)
                this.toggleItemSelection()
            }}>

                <View style={this.state.selected ? styles.trackItemSelected : styles.trackItem}>
                    <Image
                        style={{ flex: 2, width: 35, height: 35, marginRight: 10 }}
                        source={{ uri: this.props.imageSrc }}
                    />
                    <Text style={{ flex: 6 }}>
                        {this.props.title}
                    </Text>

                    {this.props.editableMode && (
                        <MaterialCommunityIcons
                            onPress={() => this.props.deleteTrack(this.props.item)}
                            name="delete"
                            size={30}
                            color="#ff4d4d"
                        >
                        </MaterialCommunityIcons>
                    )}

                </View>
            </TouchableOpacity>
        )
    }
}