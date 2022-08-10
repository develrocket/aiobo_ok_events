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
    ListItem
} from 'native-base';
import {Image, Dimensions, Linking, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import {getRequest, patchRequest, deleteRequest} from "../../actions/Service";
import Loader from '../../components/Loader';
import {bgHeader, bgContainer} from "../../styles";
import Communications from 'react-native-communications';

let {width} = Dimensions.get('window');

class AgentDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {}
        };
    }

    componentWillMount() {
        this.props.getAgentDetail(this.props.navigation.getParam('agent_id', 1));
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null) {
            this.setState({data: nextProps.data});
        }
    }

    openSMS = async(phone) => {

        const url = `sms:${phone}`;

        const supported = await Linking.canOpenURL(url);

        if (!supported) {
            return Promise.reject(new Error('Provided URL can not be handled'))
        }

        Linking.openURL(url);
    };

    render() {
        return (
            <Container style={{backgroundColor: bgContainer}}>
                <Image style={{ width: width, height: width * 1263 / 2248, position: 'absolute', bottom:0, left:0 }} source={require('../../imgs/background_1.png')} />
                <Content padder>
                    <Loader loading={this.props.isLoading} />
                    {(() => {
                        if (Object.keys(this.state.data).length > 0) {
                            return (
                                <View>
                                    <Form style={{marginBottom:20}}>
                                        <Item fixedLabel disabled>
                                            <Label>First Name</Label>
                                            <Input disabled value={this.state.data.first_name} />
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>Last Name</Label>
                                            <Input disabled value={this.state.data.last_name} />
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>Entity</Label>
                                            <Input disabled value={this.state.data.entity} />
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>Title</Label>
                                            <Input disabled value={this.state.data.title} />
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>Company</Label>
                                            <Input disabled value={this.state.data.company} />
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>Middle Initial</Label>
                                            <Input disabled value={this.state.data.middle_initial} />
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>DOB</Label>
                                            <Input disabled value={this.state.data.dob} />
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>Phone</Label>
                                            <Input disabled value={this.state.data.phone} />
                                            <Icon active name='md-chatboxes'
                                                  style={{fontSize: 25, color: bgHeader}}
                                                  onPress={() => this.openSMS(this.state.data.phone)}/>
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>Email</Label>
                                            <Input disabled value={this.state.data.email} />
                                            <Icon active name='md-mail' style={{fontSize: 25, color: bgHeader}}
                                                  onPress={() => Communications.email([this.state.data.email],null,null,null,null)}/>
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>Address</Label>
                                            <Input disabled value={this.state.data.address} />
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>City</Label>
                                            <Input disabled value={this.state.data.city} />
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>State</Label>
                                            <Input disabled value={this.state.data.state} />
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>Zip</Label>
                                            <Input disabled value={this.state.data.zip} />
                                        </Item>
                                        <Item fixedLabel disabled>
                                            <Label>Add Date</Label>
                                            <Input disabled value={this.state.data.add_date} />
                                        </Item>
                                    </Form>

                                    {(() => {
                                        if (this.state.data.campaigns) {
                                            return (
                                                <View>
                                                    <View style={{backgroundColor: '#c2ddff', paddingTop: 15, paddingLeft:15, paddingBottom: 15, marginTop: 20}}>
                                                        <Text>Campaigns List</Text>
                                                    </View>

                                                    {
                                                        this.state.data.campaigns.map((data, i) => {
                                                            return (
                                                                <ListItem key={i} style={{paddingLeft: 0, marginLeft: 0}}>
                                                                    <Body>
                                                                    {(() => {
                                                                        if (data.dealercode) {
                                                                            return (
                                                                                <Text>{data.campaign} - {data.dealercode}</Text>
                                                                            )
                                                                        }else {
                                                                            return (
                                                                                <Text>{data.campaign}</Text>
                                                                            )
                                                                        }
                                                                    })()}
                                                                    </Body>
                                                                </ListItem>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            )
                                        }
                                    })()}

                                </View>
                            )
                        }
                    })()}
                </Content>
            </Container>
        )
    }
}

AgentDetail.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Agent Detail</Title>
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
        getAgentDetail: (agent_id) => {
            dispatch(getRequest(Config.AGENT_LIST_URL + '/' + agent_id, 'agent_detail'));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(AgentDetail);