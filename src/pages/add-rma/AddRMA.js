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
    View
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

class AddRMA extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reasonList: [],
            isSubmitted: false,
            reason_id: '',
            other: '',
            serial: ''
        };
    }

    componentDidMount() {
        this.props.getReasonList();
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null) {
            if (nextProps.requestType == 'add_rma') {
                if (nextProps.data.result == 'success') {
                    this.setState({isSubmitted: true});
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
            } else if (nextProps.requestType == 'rma_reason_list') {
                this.setState({reasonList: nextProps.data});
            }
        }

        if (nextProps.error != undefined && nextProps.requestType == 'add_rma') {
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
        if (this.state.reason_id == '' || typeof this.state.reason_id == 'undefined') {
            Alert.alert(
                'Validation Error',
                'Please select issue.',
                [
                    {
                        text: 'OK', onPress: () => {}
                    }
                ],
                {cancelable: true}
            );
            return false;
        }

        if (this.state.reason_id == 18 && this.state.other == '') {
            Alert.alert(
                'Validation Error',
                'What is the missing part?',
                [
                    {
                        text: 'OK', onPress: () => {}
                    }
                ],
                {cancelable: true}
            );
            return false;
        }

        if (this.state.serial == '') {
            Alert.alert(
                'Validation Error',
                'Serial is required.',
                [
                    {
                        text: 'OK', onPress: () => {}
                    }
                ],
                {cancelable: true}
            );
            return false;
        }

        return true;
    }

    addRMA() {
        let validation = this.checkValidation();
        if (validation) {
            this.props.addRMA(this.state.reason_id, this.state.other, this.state.serial)
        }
    }

    resetData() {
        this.setState({
            isSubmitted: false,
            serial: '',
            other: ''
        });
    }

    _onScanBarcode() {
        this.props.navigation.navigate('Barcode', {
            onScanBarcode: (barcode) => this.setState({serial: barcode}),
        })
    };

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
                                        <Item style={{marginLeft: 0}} stackedLabel>
                                            <Label>Issue *</Label>
                                            <Picker
                                                note
                                                mode="dropdown"
                                                style={{width: '100%'}}
                                                selectedValue={this.state.reason_id}
                                                onValueChange={(value) => this.setState({reason_id: value})}>
                                                <Picker.Item label={'Please select'}/>
                                                {
                                                    this.state.reasonList.map((data, i) => {
                                                        return (
                                                            <Picker.Item key={i} label={data.name} value={data.id}/>
                                                        );
                                                    })
                                                }
                                            </Picker>
                                        </Item>
                                        {(() => {
                                            if (this.state.reason_id == 18) {
                                                return (
                                                    <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                                        <Label>Missing Part</Label>
                                                        <Input style={{paddingLeft: 12}}
                                                               value={this.state.other}
                                                               underlineColorAndroid='transparent'
                                                               onChangeText={(text) => this.setState({other: text})}/>
                                                    </Item>
                                                );
                                            }
                                        })()}
                                        <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                            <Label>Serial</Label>
                                            <Input
                                                style={{paddingLeft: 12}}
                                                value={this.state.serial}
                                                underlineColorAndroid='transparent'
                                                keyboardType={'numeric'}
                                                onChangeText={(text) => this.setState({serial: text})}/>
                                            <TouchableOpacity
                                                onPress={this._onScanBarcode.bind(this)}
                                                style={{position: 'absolute', right: 10, top: 33}}>
                                                <Image source={require('../../imgs/scan_icon.png')}
                                                       style={{
                                                           height: 25,
                                                           width: 20,
                                                       }}/>
                                            </TouchableOpacity>
                                        </Item>
                                    </Form>

                                    <Button block style={{backgroundColor: bgHeader, marginTop: 20, marginBottom: 50}}
                                            success onPress={() => this.addRMA()}>
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
                                    <Text style={{fontSize: 23, textAlign: 'center', color: '#444444', marginTop: 30}}>RMA added successfully!</Text>
                                    <Button block style={{backgroundColor: bgHeader, marginTop: 50, marginBottom: 50}}
                                            success onPress={() => this.resetData()}>
                                        <Text>Add Another RMA</Text>
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

AddRMA.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="md-menu" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>RMA Request</Title>
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
        getReasonList: () => {
            dispatch(getRequest(Config.RMA_REASONS_URL, 'rma_reason_list'));
        },
        addRMA: (reason_id, other, serial) => {
            dispatch(postRequest(Config.RMA_LIST_URL, {
                reason_id: reason_id,
                other: other,
                serial: serial
            }, 'add_rma'));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(AddRMA);