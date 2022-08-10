import React, {Component} from 'react';
import {
    Button,
    Container,
    Content,
    Header,
    Left,
    Body,
    Right,
    Title,
    Form,
    Item,
    Label,
    Input,
    Text,
    View,
    CheckBox,
    ListItem
} from 'native-base';
import {Image, Dimensions, Alert, TouchableOpacity, Keyboard, Picker} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import {getRequest, postRequest} from "../../actions/Service";
import Loader from '../../components/Loader';
import {bgHeader, bgContainer} from "../../styles";

let {width} = Dimensions.get('window');

class AddLocation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitted: false,
            name: '',
            address: '',
            city: '',
            state: 'OK',
            zipcode: '',
            is_d2d: false,
            start_number: '',
            end_number: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data !== null) {
            if (nextProps.requestType === 'add_location') {
                if (nextProps.data.result === 'success') {
                    this.setState({isSubmitted: true});
                    this.props.updateLocationList();
                    this.props.navigation.goBack();
                }else {
                    setTimeout(() => {
                        Alert.alert(
                            'Error',
                            nextProps.data.msg + '',
                            [
                                {
                                    text: 'OK', onPress: () => {}
                                }
                            ],
                            {cancelable: true}
                        );
                    }, 100);
                }
            }
        }

        if (nextProps.error !== undefined && nextProps.requestType === 'add_location') {
            setTimeout(() => {
                Alert.alert(
                    'Error',
                    nextProps.error.response.data + '',
                    [
                        {
                            text: 'OK', onPress: () => {
                        }
                        }
                    ],
                    {cancelable: true}
                )
            }, 100);
        }
    }

    checkValidation() {
        let errMsgs = {
            name: 'Name is required',
            address: 'Address is required',
            city: 'City is required',
            state: 'State is required',
            zipcode: 'Zipcode is required'
        };

        let keys = Object.keys(this.state);
        for (let i = 0; i < keys.length; i ++ ) {
            if (errMsgs[keys[i]]) {
                if (this.state[keys[i]] === '') {
                    Alert.alert(
                        'Validation Error',
                        errMsgs[keys[i]],
                        [
                            {
                                text: 'OK', onPress: () => {}
                            }
                        ],
                        {cancelable: true}
                    );
                    return false;
                }
            }
        }

        if (this.state.is_d2d) {
            if (this.state.start_number === '' || this.state.end_number === '') {
                Alert.alert(
                    'Validation Error',
                    'Start Number and End Number is Required.',
                    [
                        {
                            text: 'OK', onPress: () => {}
                        }
                    ],
                    {cancelable: true}
                );
                return false;
            }
        }

        return true;
    }

    addLocation() {
        let validation = this.checkValidation();
        if (validation) {
            let data = {
                name: this.state.name,
                address: this.state.address,
                city: this.state.city,
                state: this.state.state,
                zip: this.state.zipcode,
                is_d2d: this.state.is_d2d,
                start_number: this.state.start_number,
                end_number: this.state.end_number
            };
            this.props.addLocation(data);
        }
    }

    resetData() {
        this.setState({
            isSubmitted: false,
            name: '',
            address: '',
            city: '',
            state: '',
            zipcode: ''
        });
    }

    render() {

        return (
            <Container style={{backgroundColor: bgContainer}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Content padder style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20, paddingBottom: 20}}>
                    <Loader loading={this.props.isLoading}/>
                    {(() => {
                        if (!this.state.isSubmitted) {
                            return (
                                <View>
                                    <Form>
                                        <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                            <Label>Name</Label>
                                            <Input style={{paddingLeft: 12}}
                                                   value={this.state.name}
                                                   underlineColorAndroid='transparent'
                                                   onChangeText={(text) => this.setState({name: text})}/>
                                        </Item>
                                        <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                            <Label>Address</Label>
                                            <Input style={{paddingLeft: 12}}
                                                   value={this.state.address}
                                                   underlineColorAndroid='transparent'
                                                   onChangeText={(text) => this.setState({address: text})}/>
                                        </Item>
                                        <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                            <Label>City</Label>
                                            <Input style={{paddingLeft: 12}}
                                                   value={this.state.city}
                                                   underlineColorAndroid='transparent'
                                                   onChangeText={(text) => this.setState({city: text})}/>
                                        </Item>
                                        <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                            <Label>State</Label>
                                            <Input style={{paddingLeft: 12}}
                                                   value={this.state.state}
                                                   underlineColorAndroid='transparent'
                                                   editable={false}
                                                   onChangeText={(text) => this.setState({state: text})}/>
                                        </Item>
                                        <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                            <Label>Zipcode</Label>
                                            <Input style={{paddingLeft: 12}}
                                                   value={this.state.zipcode}
                                                   underlineColorAndroid='transparent'
                                                   keyboardType='numeric'
                                                   onChangeText={(text) => this.setState({zipcode: text})}/>
                                        </Item>
                                        <ListItem style={{marginLeft: 0, marginTop: 20, borderBottomWidth: 0}}>
                                            <CheckBox checked={this.state.is_d2d} onPress={() => this.setState({is_d2d: !this.state.is_d2d})} />
                                            <Body>
                                                <Text>Is Door to Door Location?</Text>
                                            </Body>
                                        </ListItem>
                                        {(() => {
                                            if (this.state.is_d2d) {
                                                return (
                                                    <View>
                                                        <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                                            <Label>Start Number</Label>
                                                            <Input style={{paddingLeft: 12}}
                                                                   value={this.state.start_number}
                                                                   underlineColorAndroid='transparent'
                                                                   keyboardType='numeric'
                                                                   onChangeText={(text) => this.setState({start_number: text})}/>
                                                        </Item>
                                                        <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                                            <Label>End Number</Label>
                                                            <Input style={{paddingLeft: 12}}
                                                                   value={this.state.end_number}
                                                                   underlineColorAndroid='transparent'
                                                                   keyboardType='numeric'
                                                                   onChangeText={(text) => this.setState({end_number: text})}/>
                                                        </Item>
                                                    </View>
                                                )
                                            }
                                        })()}
                                    </Form>

                                    <Button block style={{backgroundColor: bgHeader, marginTop: 20, marginBottom: 50}}
                                            success onPress={() => this.addLocation()}>
                                        <Text>Submit</Text>
                                    </Button>
                                </View>
                            )
                        } else {
                            return (
                                <View>
                                    <View>
                                        <Image style={{
                                            width: 120,
                                            height: 120,
                                            marginLeft: (width - 160) / 2,
                                            marginTop: 50
                                        }}
                                               source={require('../../imgs/check_icon.png')}/>
                                    </View>
                                    <Text style={{fontSize: 23, textAlign: 'center', color: '#444444', marginTop: 30, width: width}}>Location added successfully!</Text>
                                    <Button block style={{backgroundColor: bgHeader, marginTop: 50, marginBottom: 50}}
                                            success onPress={() => this.resetData()}>
                                        <Text>Add Another Location</Text>
                                    </Button>
                                </View>
                            )
                        }
                    })()}
                </Content>
            </Container>
        )
    }
}

AddLocation.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Add Location</Title>
            </Body>
            <Right>
                <Button transparent onPress={() => navigation.navigate("Home")}>
                    <Icon name="md-home" style={s.menuIcon}/>
                </Button>
            </Right>
        </Header>
    )
});


const mapStateToProps = (state, ownProps) => {
    return {
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addLocation: (data) => {
            dispatch(postRequest(Config.LOCATION_LIST_URL, data, 'add_location'));
        },
        updateLocationList: () => {
            dispatch(getRequest(Config.LOCATION_LIST_URL, 'update_location_list'));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(AddLocation);