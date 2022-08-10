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
    Card,
    CardItem,
    Picker
} from 'native-base';
import {Image, Dimensions, TouchableOpacity, TextInput, Alert, Keyboard, Platform, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import {getRequest, postRequest} from "../../actions/Service";
import Loader from '../../components/Loader';
import {bgHeader, bgContainer} from "../../styles";

let {width} = Dimensions.get('window');

class TransferInventory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            agentList: [],
            barcodeList: [''],
            isSubmitted: false,
            phone: '',
            email: '',
            agent_id: '',
            agent_name: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null) {
            if (nextProps.requestType == 'transfer_inventory') {
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
            }
        }
    }


    transferInventory() {
        if (this.state.agent_id == '') {
            Alert.alert(
                'Validation Error',
                'Please select agent.',
                [
                    {
                        text: 'OK', onPress: () => {}
                    }
                ],
                {cancelable: true}
            );
            return;
        }

        if (this.state.barcodeList.length == 0) {
            Alert.alert(
                'Validation Error',
                'You need to input at least one serial.',
                [
                    {
                        text: 'OK', onPress: () => {
                    }
                    }
                ],
                {cancelable: true}
            );
            return;
        }

        this.props.tranferInventory(this.state.agent_id, this.state.barcodeList.slice(0, this.state.barcodeList.length - 1));
    }

    resetData() {
        this.setState({agent_id: '', barcodeList: [''], isSubmitted: false})
    }

    _onScanBarcode() {
        this.props.navigation.navigate('Barcode', {
            onScanBarcode: (barcode) => this.addBarcode(barcode),
        })
    };

    addBarcode(barcode) {
        let barcodeList = this.state.barcodeList;
        barcodeList[barcodeList.length - 1] = barcode;
        barcodeList.push('');
        this.setState({barcodeList: barcodeList})
    }

    removeBarcode(index) {
        let barcodeList = this.state.barcodeList;
        barcodeList.splice(index, 1);
        this.setState({barcodeList: barcodeList});
    }

    setBarcode(barcode, index) {
        let barcodeList = this.state.barcodeList;
        barcodeList[index] = barcode;
        if (barcodeList[barcodeList.length - 1] != '') {
            barcodeList.push('');
        }
        this.setState({barcodeList: barcodeList})
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
                                    <Card>
                                        <CardItem style={{paddingTop: 0, paddingBottom: 0, height: 50, width: '100%'}}>
                                            <Icon name='md-person' style={{
                                                fontSize: 25,
                                                position: 'absolute',
                                                left: 17,
                                                top: 12
                                            }} />
                                            <Body>
                                            {(() => {
                                                if (this.state.agent_id != '') {
                                                    return (
                                                        <View style={{width: width - 110, marginLeft: 30, paddingTop: 3}}>
                                                            <Text>{this.state.agent_name}</Text>
                                                            <Text note>{this.state.agent_id}</Text>
                                                            <Icon name='md-close'
                                                                  onPress={() => this.setState({agent_id: ''})}
                                                                  style={{
                                                                      fontSize: 25,
                                                                      position: 'absolute',
                                                                      right: 0,
                                                                      top: 11
                                                                  }}/>
                                                        </View>
                                                    )
                                                }else {
                                                    return (
                                                        <TextInput
                                                            style={styles.agentInput}
                                                            value={this.state.agent}
                                                            underlineColorAndroid='transparent'
                                                            onFocus={Keyboard.dismiss}
                                                            onTouchStart={() => {
                                                                this.props.navigation.navigate('AgentList', {
                                                                    search_type: 'transfer_inventory',
                                                                    onSelectAgent: (agent_id, text) => {
                                                                        this.setState({agent_id: agent_id, agent_name: text.split(' - ')[0]})
                                                                    }
                                                                })
                                                            }}/>
                                                    );
                                                }
                                            })()}
                                            </Body>
                                        </CardItem>
                                    </Card>
                                    {
                                        this.state.barcodeList.map((data, i) => (
                                            <Card key={i}>
                                                <CardItem style={{paddingTop: 0, paddingBottom: 0, width: '100%'}}>
                                                    <Body style={{flex: 1, flexDirection: 'row'}}>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder='Enter Serial...'
                                                        value={data}
                                                        keyboardType={'numeric'}
                                                        underlineColorAndroid='transparent'
                                                        onChangeText={(text) => this.setBarcode(text, i)}/>
                                                    {(() => {
                                                        if (data == '') {
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={this._onScanBarcode.bind(this)}
                                                                    style={{position: 'absolute', right: 0, top: 8}}>
                                                                    <Image source={require('../../imgs/scan_icon.png')}
                                                                           style={{
                                                                               height: 25,
                                                                               width: 20,
                                                                           }}/>
                                                                </TouchableOpacity>
                                                            );
                                                        } else {
                                                            return (
                                                                <Icon name='md-close'
                                                                      onPress={() => this.removeBarcode(i)}
                                                                      style={{
                                                                          fontSize: 25,
                                                                          position: 'absolute',
                                                                          right: 0,
                                                                          top: 8
                                                                      }}/>
                                                            )
                                                        }
                                                    })()}
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        ))
                                    }

                                    <Button block style={{backgroundColor: bgHeader, marginTop: 20, marginBottom: 50}}
                                            success onPress={() => this.transferInventory()}>
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
                                    <Text style={{fontSize: 23, textAlign: 'center', color: '#444444', marginTop: 30}}>inventory
                                        transferred successfully!</Text>
                                    <Button block style={{backgroundColor: bgHeader, marginTop: 50, marginBottom: 50}}
                                            success onPress={() => this.resetData()}>
                                        <Text>Transfer Another Inventory</Text>
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

TransferInventory.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="md-menu" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Transfer Inventory</Title>
            </Body>
            <Right>
                <Button transparent onPress={() => navigation.navigate("Home")}>
                    <Icon name="md-home" style={s.menuIcon}/>
                </Button>
            </Right>
        </Header>
    )
});

const styles = StyleSheet.create({
    input: {
        fontSize: 15,
        width: '100%',
        ...Platform.select({
            ios: {
                height: 50,
            },
            android: {
                paddingTop: 10
            }
        }),
    },
    agentInput: {
        width: '100%',
        marginLeft: 25,
        ...Platform.select({
            ios: {
                height: 50,
            },
            android: {
                paddingTop: 16,
            }
        }),
    }
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
        tranferInventory: (agent_id, barcodeList) => {
            dispatch(postRequest(Config.SEND_TRANSFER_URL, {agent_id:agent_id, serials: barcodeList}, 'transfer_inventory'))
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(TransferInventory);