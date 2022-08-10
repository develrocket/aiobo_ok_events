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
import {getRequest, postRequest, patchRequest} from "../../actions/Service";
import Loader from '../../components/Loader';
import {bgHeader, bgContainer} from "../../styles";
import {TextInputMask} from 'react-native-masked-text'

let {width} = Dimensions.get('window');

class PendingAgentEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            campaignList: [],
            isSubmitted: false,
            phone: '',
            email: '',
            agent_id: '',
            referral_id: '',
            oldData: {}
        };
    }

    componentWillMount() {
        this.setState({
            agent_id: this.props.navigation.getParam('agent_id', ''),
            referral_id: this.props.navigation.getParam('referral_id', '')
        });
        this.props.getCampaignList();
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null) {
            if (nextProps.requestType == 'pending_agent_campaign_list') {
                let campaignList = nextProps.data;
                for (let i = 0; i < campaignList.length; i ++) {
                    campaignList[i].type = 0 + '';
                }
                this.setState({campaignList: campaignList});
                this.props.getAgentDetail(this.state.referral_id);
            }else if (nextProps.requestType == 'pending_agent_detail') {
                let agentData = nextProps.data;
                let campaignList = this.state.campaignList;
                this.setState({oldData: agentData, phone: agentData.phone, email: agentData.email});
                for (let i = 0; i < campaignList.length; i ++) {
                    if (agentData.campaigns.indexOf(campaignList[i].id) >= 0) {
                        campaignList[i].type = 1 + '';
                    }
                    if (agentData.recruiting_campaigns.indexOf(campaignList[i].id) >= 0) {
                        campaignList[i].type = 2 + '';
                    }
                }
                this.setState({campaignList: campaignList});
            }else if (nextProps.requestType == 'pending_agent_update') {
                Alert.alert(
                    'Success',
                    'Agent updated successfully!',
                    [
                        {
                            text: 'OK', onPress: () => {
                        }
                        }
                    ],
                    {cancelable: true}
                )
            }
        }

        if (nextProps.error != undefined && nextProps.requestType == 'send_application') {
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

    updateAgent() {
        console.log('send-application');
        let validation = this.checkValidation();
        if (validation) {

            let campaigns = [];
            let recruitingCampaigns = [];
            let campaignList = this.state.campaignList;
            for (let i = 0; i < campaignList.length; i ++) {
                if (campaignList[i].type == 1) {
                    campaigns.push(campaignList[i].id)
                }else if (campaignList[i].type == 2) {
                    recruitingCampaigns.push(campaignList[i].id)
                }
            }

            let data = {
                agent_id: this.state.agent_id,
                referral_id: this.state.referral_id,
                old_campaigns: this.state.oldData.campaigns,
                old_recruiting_campaigns: this.state.oldData.recruiting_campaigns,
                old_email: this.state.oldData.email,
                old_phone: this.state.oldData.phone,
                email: this.state.email,
                phone: this.state.phone,
                campaigns: campaigns,
                recruiting_campaigns: recruitingCampaigns
            };

            this.props.updateAgent(data);
        }
    }

    render() {
        return (
            <Container style={{backgroundColor: bgContainer}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Content padder style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20, paddingBottom: 20}}>
                    <Loader loading={this.props.isLoading}/>

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
                                    value={this.state.email}
                                />
                            </Item>
                        </Form>

                        <Text style={{fontSize: 23, paddingLeft: 0, color: '#444444'}}>Campaigns</Text>

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
                                success onPress={() => this.updateAgent()}>
                            <Text>Submit</Text>
                        </Button>
                    </View>

                </Content>
            </Container>
        )
    }
}

PendingAgentEdit.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Pending Agent Edit</Title>
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
            dispatch(getRequest(Config.CAMPAIGN_LIST_URL, 'pending_agent_campaign_list'));
        },
        getAgentDetail: (referral_id) => {
            dispatch(getRequest(Config.PENDING_AGENT_LIST_URL + '/' + referral_id, 'pending_agent_detail'));
        },
        updateAgent(data) {
            dispatch(patchRequest(Config.PENDING_AGENT_LIST_URL, data, 'pending_agent_update'));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(PendingAgentEdit);