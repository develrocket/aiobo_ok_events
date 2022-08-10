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

class CreateOrder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            agentList: [],
            isSubmitted: false,
            agent: '',
            query: '',
            agent_id: '',
            shippingAddresses: [],
            items: [],
            shipping_address_id: '',
            item_id: '',
            item_type: '',
            serial: '',
            quantity: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null) {
            if (nextProps.requestType == 'create_order') {
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
            } else if (nextProps.requestType == 'order_get_entity') {
                this.setState({shippingAddresses: nextProps.data.shipping_addresses, items: nextProps.data.items});
                if (nextProps.data.shipping_addresses.length == 1) {
                    this.setState({shipping_address_id: nextProps.data.shipping_addresses[0].id})
                }
                if (nextProps.data.items.length == 1) {
                    this.setState({item_id: nextProps.data.items[0].id});
                    this.setState({item_type: nextProps.data.items[0].type});
                }
            }
        }

        if (nextProps.error != undefined && nextProps.requestType == 'create_order') {
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
            return false;
        }

        if (this.state.shipping_address_id == '' || typeof this.state.shipping_address_id == 'undefined') {
            Alert.alert(
                'Validation Error',
                'Please select shipping address.',
                [
                    {
                        text: 'OK', onPress: () => {}
                    }
                ],
                {cancelable: true}
            );
            return false;
        }

        if (this.state.item_id == '' || typeof this.state.item_id == 'undefined') {
            Alert.alert(
                'Validation Error',
                'Please select item.',
                [
                    {
                        text: 'OK', onPress: () => {}
                    }
                ],
                {cancelable: true}
            );
            return false;
        }

        if (this.state.item_type == 5 || this.state.item_type == 6) {
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
        }else {
            if (this.state.quantity == '') {
                Alert.alert(
                    'Validation Error',
                    'Quantity is required.',
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

    createOrder() {
        let validation = this.checkValidation();
        if (validation) {
            this.props.createOrder(this.state.agent_id, this.state.shipping_address_id, this.state.item_id, this.state.item_type, this.state.serial, this.state.quantity);
        }
    }

    resetData() {
        this.setState({
            isSubmitted: false,
        });
    }

    _onScanBarcode() {
        this.props.navigation.navigate('Barcode', {
            onScanBarcode: (barcode) => this.setState({serial: barcode}),
        })
    };

    onItemSelect(itemId) {
        this.setState({item_id: itemId});
        for (let i = 0; i < this.state.items.length; i ++) {
            if (this.state.items[i].id == itemId) {
                this.setState({item_type: this.state.items[i].type});
            }
        }
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
                                        <Item style={{marginLeft: 0}} stackedLabel>
                                            <Label>Issue to Agent *</Label>
                                            <Input
                                                value={this.state.agent}
                                                style={{paddingLeft: 12}}
                                                onFocus={Keyboard.dismiss}
                                                onTouchStart={() => {
                                                    this.props.navigation.navigate('AgentList', {
                                                        search_type: 'create_order',
                                                        onSelectAgent: (agent_id, text) => {
                                                            this.setState({agent_id: agent_id, agent: text});
                                                            this.props.getEntityInfo(agent_id);
                                                        }
                                                    })
                                                }}/>
                                        </Item>
                                        <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                            <Label>Shipping Address *</Label>
                                            <Picker
                                                note
                                                mode="dropdown"
                                                style={{width: '100%'}}
                                                selectedValue={this.state.shipping_address_id}
                                                onValueChange={(value) => this.setState({shipping_address_id: value})}>
                                                <Picker.Item label={'Please select'}/>
                                                {
                                                    this.state.shippingAddresses.map((data, i) => {
                                                        return (
                                                            <Picker.Item key={i} label={data.name} value={data.id}/>
                                                        );
                                                    })
                                                }
                                            </Picker>
                                        </Item>
                                        <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                            <Label>Item *</Label>
                                            <Picker
                                                note
                                                mode="dropdown"
                                                style={{width: '100%'}}
                                                selectedValue={this.state.item_id}
                                                onValueChange={(value) => this.onItemSelect(value)}>
                                                <Picker.Item label={'Please select'}/>
                                                {
                                                    this.state.items.map((data, i) => {
                                                        return (
                                                            <Picker.Item key={i} label={data.name} value={data.id}/>
                                                        );
                                                    })
                                                }
                                            </Picker>
                                        </Item>
                                        {(() => {
                                            if (this.state.item_type == 5 || this.state.item_type == 6) {
                                                return (
                                                    <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                                        <Label>Serial</Label>
                                                        <Input
                                                            style={{paddingLeft: 12}}
                                                            value={this.state.serial}
                                                            underlineColorAndroid='transparent'
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
                                                )
                                            } else {
                                                return (
                                                    <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                                        <Label>Quantity</Label>
                                                        <Input style={{paddingLeft: 12}}
                                                               value={this.state.quantity}
                                                               underlineColorAndroid='transparent'
                                                               keyboardType='numeric'
                                                               onChangeText={(text) => this.setState({quantity: text})}/>
                                                    </Item>
                                                )
                                            }
                                        })()}
                                    </Form>

                                    <Button block style={{backgroundColor: bgHeader, marginTop: 20, marginBottom: 50}}
                                            success onPress={() => this.createOrder()}>
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
                                    <Text style={{fontSize: 23, textAlign: 'center', color: '#444444', marginTop: 30}}>order
                                        created successfully!</Text>
                                    <Button block style={{backgroundColor: bgHeader, marginTop: 50, marginBottom: 50}}
                                            success onPress={() => this.resetData()}>
                                        <Text>Create Another Order</Text>
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

CreateOrder.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="md-menu" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Create Order</Title>
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
        getEntityInfo: (agent_id) => {
            dispatch(getRequest(Config.ENTITY_URL + agent_id, 'order_get_entity'));
        },
        createOrder: (agent_id, shipping_address_id, item_id, item_type, serial, quantity) => {
            dispatch(postRequest(Config.ORDER_LIST_URL, {
                agent_id: agent_id,
                shipping_address_id: shipping_address_id,
                item_id: item_id,
                item_type: item_type,
                serial: serial,
                quantity: quantity
            }, 'create_order'));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(CreateOrder);