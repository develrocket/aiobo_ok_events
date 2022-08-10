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
    Text,
    View,
    Card,
    CardItem,
    Picker
} from 'native-base';
import {Image, Dimensions, Alert, Platform, StyleSheet, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import {getRequest, postRequest} from "../../actions/Service";
import Loader from '../../components/Loader';
import {bgHeader, bgContainer} from "../../styles";
import {TextInputMask} from 'react-native-masked-text'

let {width} = Dimensions.get('window');

class SendApplication extends Component {
    constructor(props) {
        super(props);

        this.state = {
            campaignList: [],
            isSubmitted: false,
            phone: '',
            email: ''
        };
    }

    componentWillMount() {
        this.props.getCampaignList();
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null) {
            if (nextProps.requestType == 'campaign_list') {
                let campaignList = nextProps.data;
                for (let i = 0; i < campaignList.length; i ++) {
                    campaignList[i].type = 0 + '';
                }
                this.setState({campaignList: campaignList});
            }else if (nextProps.requestType == 'send_application') {
                this.setState({isSubmitted: true});
            }
        }

        if (nextProps.error != undefined && nextProps.requestType == 'send_application') {
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

    onValueChange(value, campaignId) {
        let campaignList = this.state.campaignList;
        for (let i = 0; i < campaignList.length; i++) {
            if (campaignList[i].id == campaignId) {
                campaignList[i].type = value;
                break;
            }
        }
        this.setState({
            campaignList: campaignList
        });
    }

    validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    checkValidation() {
        if (!this.state.phone) {
            Alert.alert(
                'Validation Error',
                'Phone number is required.',
                [
                    {
                        text: 'OK', onPress: () => {
                    }
                    }
                ],
                {cancelable: true}
            );
            return false;
        }

        if (this.state.phone.length != 12) {
            Alert.alert(
                'Validation Error',
                'Invalid phone number.',
                [
                    {
                        text: 'OK', onPress: () => {
                    }
                    }
                ],
                {cancelable: true}
            );
            return false;
        }

        if (!this.state.email) {
            Alert.alert(
                'Validation Error',
                'Email is required.',
                [
                    {
                        text: 'OK', onPress: () => {
                    }
                    }
                ],
                {cancelable: true}
            );
            return false;
        }

        if (!this.validateEmail(this.state.email)) {
            Alert.alert(
                'Validation Error',
                'Invalid email.',
                [
                    {
                        text: 'OK', onPress: () => {
                    }
                    }
                ],
                {cancelable: true}
            );
            return false;
        }
        return true;
    }

    sendApplication() {
        console.log('send-application');
        let validation = this.checkValidation();
        if (validation) {
            this.props.sendApplication(this.state.email, this.state.phone, this.state.campaignList);
        }
    }

    resetData() {
        this.setState({email: '', phone: '', isSubmitted: false});
        let campaignList = this.state.campaignList;
        for (let i = 0; i < campaignList.length; i++) {
            campaignList[i].type = 0;
        }
        this.setState({
            campaignList: campaignList
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
                                    <Form style={{marginBottom: 20}}>
                                        <Item style={{marginLeft: 0}}>
                                            <Icon active name='md-call' style={{fontSize: 25}}/>
                                            <TextInputMask
                                                placeholder='phone number'
                                                keyboardType='numeric'
                                                type={'custom'}
                                                value={this.state.phone}
                                                onChangeText={(text) => this.setState({phone: text})}
                                                options={{
                                                    mask: '999-999-9999'
                                                }}
                                                style={styles.inputMask}
                                                underlineColorAndroid='transparent'
                                            />
                                        </Item>
                                        <Item style={{marginLeft: 0, marginTop: 20}}>
                                            <Icon active name='md-mail' style={{fontSize: 25}}/>
                                            <TextInput
                                                placeholder='email address'
                                                keyboardType='email-address'
                                                onChangeText={(text) => this.setState({email: text})}
                                                style={styles.input}
                                                underlineColorAndroid='transparent'
                                            />
                                        </Item>
                                    </Form>

                                    <Text style={{fontSize: 23, paddingLeft: 0, color: '#444444'}}>Campaigns</Text>
                                    <Text style={{
                                        fontSize: 15,
                                        paddingLeft: 0,
                                        color: '#444444',
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}>
                                        Regular campaign applicants will be screened for dealercodes. Recruitment
                                        campaign applicants will not be.
                                    </Text>

                                    {
                                        this.state.campaignList.map((data, i) => (
                                            <Card key={i}>
                                                <CardItem style={{width: '100%'}}>
                                                    <Body style={{flex: 1, flexDirection: 'row'}}>
                                                    <Text>
                                                        {data.name}
                                                    </Text>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        width: 120,
                                                        position: 'absolute',
                                                        right: 0
                                                    }}>
                                                        <Text>:</Text>
                                                        <Picker
                                                            note
                                                            mode="dropdown"
                                                            style={{width: 120, height: 20}}
                                                            selectedValue={data.type}
                                                            onValueChange={(value) => this.onValueChange(value, data.id)}>
                                                            <Picker.Item label="Not Selected" value="0"/>
                                                            <Picker.Item label="Campaign" value="1"/>
                                                            <Picker.Item label="Recruitment" value="2"/>
                                                        </Picker>
                                                    </View>
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        ))
                                    }

                                    <Button block style={{backgroundColor: bgHeader, marginTop: 20, marginBottom: 50}}
                                            success onPress={() => this.sendApplication()}>
                                        <Text>Submit</Text>
                                    </Button>
                                </View>
                            )
                        }else {
                            return (
                                <View>
                                    <View>
                                        <Image style={{width: 120, height: 120, marginLeft: (width - 160) / 2, marginTop: 50}}
                                                 source={require('../../imgs/check_icon.png')}/>
                                    </View>
                                    <Text style={{fontSize: 23, textAlign: 'center', color: '#444444', marginTop: 30}}>application sent!</Text>
                                    <Button block style={{backgroundColor: bgHeader, marginTop: 50, marginBottom: 50}}
                                            success onPress={() => this.resetData()}>
                                        <Text>Add Another Agent</Text>
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

SendApplication.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="md-menu" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Send Agent Application</Title>
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
        width: '100%',
        paddingLeft: 10,
        ...Platform.select({
            ios: {
                height: 50
            },
            android: {
                paddingTop: 10,
            },
        }),
    },
    inputMask: {
        width: '100%',
        paddingLeft: 10,
        ...Platform.select({
            ios: {
                height: 50
            },
            android: {
                paddingTop: 10,
            }
        }),
    },
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
        getCampaignList: () => {
            dispatch(getRequest(Config.CAMPAIGN_LIST_URL, 'campaign_list'));
        },
        sendApplication(email, phone, campaignList) {
            let campaignData = campaignList;
            for (let i = 0; i < campaignData.length; i ++) {
                if (typeof campaignData[i].type == 'undefined') {
                    campaignData[i].type = 0;
                }
            }
            dispatch(postRequest(Config.SEND_APPLICATION_URL, {email: email, phone: phone, campaigns: campaignData}, 'send_application'));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(SendApplication);