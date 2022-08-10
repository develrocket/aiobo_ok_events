import React, {Component} from 'react';
import {
    Button,
    Header,
    Left,
    Body,
    Right,
    Title,
    ListItem,
    Text,
    Badge,
    Segment,
    ActionSheet,
    Card,
    CardItem
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import Loader from '../../components/Loader';
import {postRequest} from "../../actions/Service";
import {
    ListView,
    View,
    Dimensions,
    Image,
    Linking,
    Platform,
    StyleSheet,
    Alert,
    Clipboard
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {bgHeader, bgContainer} from "../../styles";
import Communications from 'react-native-communications';
import Toast from 'react-native-simple-toast';

let {width} = Dimensions.get('window');


class AgentDownList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            isRendering: true,
            type: 1,
            up_id: null,
            keyword: null,
            page_no: 1,
            total_count: 0,
            deleting_agent_id: '',
            canLoadMoreContent: false
        };
    }

    componentDidMount() {
        this.setState({isRendering: true, up_id: this.props.navigation.getParam('agent_id', 1)});
        this.props.getAgentList(this.state.type, this.props.navigation.getParam('agent_id', 1), this.state.keyword, this.state.page_no);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null) {
            if (nextProps.requestType == 'agent_down_list_' + this.state.up_id) {
                this.setState({data: this.getUpdatedDataSource(nextProps), total_count: nextProps.data['count']});
                if (nextProps.data.agents.length < 20) {
                    this.setState({canLoadMoreContent: false})
                }else {
                    this.setState({canLoadMoreContent: true})
                }
            }else if (nextProps.requestType == 'agent_down_resent_link_' + this.state.up_id) {
                Alert.alert(
                    'Success',
                    'Agent link resent successfully!',
                    [
                        {
                            text: 'OK', onPress: () => {}
                        }
                    ],
                    {cancelable: true}
                )
            }else if (nextProps.requestType == 'agent_down_delete_agent_' + this.state.up_id) {
                let rows = [];
                for (let i = 0; i < this.state.dataSource.length; i ++) {
                    if (this.state.dataSource[i].agent_id != this.state.deleting_agent_id) {
                        rows.push(this.state.dataSource[i]);
                    }
                }
                this.setState({dataSource: rows, deleting_agent_id: ''});
                let ids = rows.map((obj, index) => index);
                this.setState({data: this.state.data.cloneWithRows(rows, ids)});
            }
        }
    }

    getUpdatedDataSource(props) {
        let rows = this.state.dataSource.concat(props.data['agents']);
        this.setState({dataSource: rows});
        let ids = rows.map((obj, index) => index);
        return this.state.data.cloneWithRows(rows, ids);
    }

    _rowHasChanged(r1, r2) {
        // You might want to use a different comparison mechanism for performance.
        return JSON.stringify(r1) !== JSON.stringify(r2);
    }

    loadMoreAgent = async () => {
        console.log('load-more-agent');
        if (this.state.canLoadMoreContent) {
            this.props.getAgentList(this.state.type, this.state.up_id, this.state.keyword, this.state.page_no + 1);
            this.setState({page_no: this.state.page_no + 1});
        }
        // this.setState({isRendering: false});
    };

    searchByKeyword() {
        this.props.navigation.setParams({agent: 'Agent List', is_root: true});
        this.setState({dataSource: [], page_no: 1, canLoadMoreContent: true, isRendering: true, up_id: ''});
        this.props.getAgentList(this.state.type, '', this.state.keyword, 1);
    }

    updateType(value) {
        this.setState({type: value, dataSource: [], page_no: 1, canLoadMoreContent: true});
        this.props.getAgentList(value, this.state.up_id, this.state.keyword, 1);
    }

    openSMS = async(phone) => {

        const url = `sms:${phone}`;

        const supported = await Linking.canOpenURL(url);

        if (!supported) {
            return Promise.reject(new Error('Provided URL can not be handled'))
        }

        Linking.openURL(url);
    };

    showViewOptions(data) {
        let BUTTONS = ["Send SMS", "Send Email", "Call", "View", "Cancel"];
        if (this.state.type == 3) {
            BUTTONS = ["Send SMS", "Send Email", "Call", "View", "Edit", "Resend Link", "Copy Link", "Delete", "Cancel"];
        }
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: this.state.type == 3 ? 7 : 4,
                title: "Select an option"
            },
            buttonIndex => {
                if (buttonIndex == 3) {
                    this.props.navigation.navigate("AgentDetail", {agent_id: data.agent_id});
                }else if (buttonIndex == 0) {
                    this.openSMS(data.phone);
                }else if (buttonIndex == 1) {
                    Communications.email([data.email],null,null,null,null)
                }else if (buttonIndex == 2) {
                    Communications.phonecall(data.phone, true)
                }
                if (this.state.type == 3) {
                    if (buttonIndex == 7) {
                        Alert.alert(
                            'Delete Agent',
                            'Are you sure?',
                            [
                                {
                                    text: 'OK', onPress: () => {this.setState({deleting_agent_id: data.agent_id}); this.props.deleteAgent(data.agent_id, this.state.up_id);}
                                },
                                {
                                    text: 'Cancel', onPress: () => {}
                                }
                            ],
                            {cancelable: true}
                        )
                    }else if (buttonIndex == 5) {
                        this.props.resendLink(data.agent_id, data.email, data.phone, this.state.up_id);
                    }else if (buttonIndex == 6) {
                        Clipboard.setString(data.application_link);
                        Toast.show('Link is copied to clipboard.');
                    }else if (buttonIndex == 4) {
                        this.props.navigation.navigate('PendingAgentEdit', {agent_id: data.agent_id, referral_id: data.referral_id})
                    }
                }
            }
        );
    }


    render() {
        return (
            <View style={{ flex:1, backgroundColor: bgContainer }}>
                <Image style={{ width: width, height: width * 1263 / 2248, position: 'absolute', bottom:0, left:0 }} source={require('../../imgs/background_1.png')} />
                <Loader loading={this.props.isLoading} />
                <Segment style={{backgroundColor: bgHeader}}>
                    <Button first onPress={() => this.updateType(1)} active={this.state.type == 1}>
                        <Text style={{fontSize: 12, color: this.state.type == 1 && Platform.OS == 'android' ? bgHeader : '#fff'}}>&nbsp;&nbsp;&nbsp;All&nbsp;&nbsp;&nbsp;</Text>
                    </Button>
                    <Button onPress={() => this.updateType(2)} active={this.state.type == 2}>
                        <Text style={{fontSize: 12, color: this.state.type == 2 && Platform.OS == 'android' ? bgHeader : '#fff'}}>Active</Text>
                    </Button>
                    <Button onPress={() => this.updateType(3)} active={this.state.type == 3}>
                        <Text style={{fontSize: 12, color: this.state.type == 3 && Platform.OS == 'android' ? bgHeader : '#fff'}}>Pending</Text>
                    </Button>
                    <Button last onPress={() => this.updateType(4)} active={this.state.type == 4}>
                        <Text style={{fontSize: 12, color: this.state.type == 4 && Platform.OS == 'android' ? bgHeader : '#fff'}}>Inactive</Text>
                    </Button>
                </Segment>
                <SearchBar
                    lightTheme
                    onChangeText={(text) => this.setState({keyword: text})}
                    onClear={(text) => this.setState({keyword: ''})}
                    onEndEditing={this.searchByKeyword.bind(this)}
                    value={this.state.keyword}
                    inputStyle={styles.searchBar}
                    placeholder='Type Here...' />

                {(() => {
                    if (this.state.dataSource.length == 0 && !this.props.isLoading) {
                        return (
                            <Text style={{textAlign: 'center', marginTop: 50}}>There are no agents.</Text>
                        );
                    } else {
                        return (
                            <View>
                                <ListItem style={{marginLeft: 0, paddingRight: 0}}>
                                    <Card>
                                        <CardItem>
                                            <Body>
                                            <Text style={{marginTop: 3}}>Total Counts</Text>
                                            </Body>
                                            <Right style={{flexDirection: 'row', height: 28}}>
                                                <Badge style={{backgroundColor: bgHeader, position:'absolute', right: 20, top: 1}}>
                                                    <Text style={{fontSize: 13}}>{this.state.total_count}</Text>
                                                </Badge>
                                            </Right>
                                        </CardItem>
                                    </Card>
                                </ListItem>

                                <ListView
                                    dataSource={this.state.data}
                                    renderRow={data => {
                                        return (
                                            <ListItem>
                                                <Body>
                                                {(() => {
                                                    if (this.state.type == 3) {
                                                        return (
                                                            <Text onPress={() => this.showViewOptions(data)}>Pending - {data.agent_id}</Text>
                                                        )
                                                    }else {
                                                        return (
                                                            <Text onPress={() => this.showViewOptions(data)}>{data.agent}</Text>
                                                        )
                                                    }
                                                })()}
                                                <Text note style={{fontSize: 10}} onPress={() => this.showViewOptions(data)}><Icon name='md-call'/>&nbsp; {data.phone}</Text>
                                                <Text note style={{fontSize: 10}} onPress={() => this.showViewOptions(data)}><Icon name='md-mail'/>&nbsp; {data.email}</Text>
                                                {(() => {
                                                    if (this.state.type == 3) {
                                                        return (
                                                            <Text note style={{fontSize: 10}} onPress={() => this.showViewOptions(data)}><Icon name='md-calendar'/>&nbsp; Sent Date: {data.sent_date}</Text>
                                                        )
                                                    }
                                                })()}
                                                </Body>
                                                <Right style={{flexDirection: 'row'}}>
                                                    {(() => {
                                                        if (data.downline > 0) {
                                                            return (
                                                                <Icon name='md-contacts' style={{fontSize: 30, marginLeft: 10}}
                                                                      onPress={() => this.props.navigation.navigate("AgentDown", {agent_id: data.agent_id, agent: data.agent})}/>
                                                            );
                                                        }
                                                    })()}
                                                    <Icon name="ios-arrow-forward" style={s.itemDetailIcon}/>
                                                </Right>
                                            </ListItem>
                                        );
                                    }}
                                    onEndReachedThreshold={20}
                                    onEndReached={this.loadMoreAgent.bind(this)}
                                />
                            </View>
                        );
                    }
                })()}


            </View>
        )
    }
}

AgentDownList.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                {(() => {
                    if (navigation.getParam('is_root', false)) {
                        return (
                            <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                                <Icon name="md-menu" style={s.menuIcon}/>
                            </Button>
                        )
                    }else {
                        return (
                            <Button transparent onPress={() => navigation.goBack()}>
                                <Icon name="md-arrow-back" style={s.menuIcon}/>
                            </Button>
                        )
                    }
                })()}
            </Left>
            <Body>
            <Title style={{color: '#fff', width: 200}}>{navigation.getParam('agent', 'Agent List')}</Title>
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
    searchBar: {
        ...Platform.select({
            android: {
                paddingTop: 10,
            },
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
        getAgentList: (type, up_id, keyword, page_no) => {
            dispatch(postRequest(Config.AGENT_LIST_URL, {type: type, up_id: up_id, keyword: keyword, page_no: page_no}, 'agent_down_list_' + up_id));
        },
        resendLink: (agent_id, email, phone, up_id) => {
            dispatch(postRequest(Config.AGENT_RESEND_LINK_URL, {agent_id: agent_id, email: email, phone: phone}, 'agent_down_resent_link_' + up_id));
        },
        deleteAgent: (agent_id, up_id) => {
            dispatch(deleteRequest(Config.PENDING_AGENT_LIST_URL + '/' + agent_id, 'agent_down_delete_agent_' + up_id));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AgentDownList);