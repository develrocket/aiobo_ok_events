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
    CardItem,
    Picker
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import Loader from '../../components/Loader';
import {getRequest} from "../../actions/Service";
import {
    ListView,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';
import {bgHeader, bgContainer} from "../../styles";
import {Col, Row, Grid} from 'react-native-easy-grid';

let {width} = Dimensions.get('window');


class CampaignDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            isRendering: true,
            page_no: 1,
            type: 1,
            start: '',
            end: '',
            campaign_id : '',
            agent_id: '',
            agentData: {},
            canLoadMoreContent: false
        };
    }

    componentDidMount() {
        console.log('home-did-mount');
        let type = this.props.navigation.getParam('type', 1);
        let start = this.props.navigation.getParam('start', '');
        let end = this.props.navigation.getParam('end', '');
        let campaignId = this.props.navigation.getParam('campaign_id', 1);
        let agentId = this.props.navigation.getParam('agent_id', '');
        let agentData = this.props.navigation.getParam('agent_data', {});
        this.setState({
            isRendering: true,
            campaign_id: campaignId,
            agent_id: agentId,
            type: type,
            agentData: agentData,
            start: start,
            end: end
        });
        this.props.getAgentReportList(this.state.page_no, type, campaignId, agentId, start, end);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null && nextProps.requestType == 'agent_report_list_' + this.state.agent_id) {
            this.setState({data: this.getUpdatedDataSource(nextProps)});
            if (nextProps.data.length < 20) {
                this.setState({canLoadMoreContent: false})
            }else {
                this.setState({canLoadMoreContent: true})
            }
        }
    }

    getUpdatedDataSource(props) {
        let data = props.data;
        if (this.state.dataSource.length == 0) {
            this.setState({agentData: props.data[0]});
        }
        if (this.state.dataSource.length == 0) {
            data = data.slice(1);
        }
        let rows = this.state.dataSource.concat(data);
        this.setState({dataSource: rows});
        let ids = rows.map((obj, index) => index);
        return this.state.data.cloneWithRows(rows, ids);
    }

    _rowHasChanged(r1, r2) {
        // You might want to use a different comparison mechanism for performance.
        return JSON.stringify(r1) !== JSON.stringify(r2);
    }

    loadMoreActivity = async () => {
        if (this.state.canLoadMoreContent) {
            this.props.getAgentReportList(this.state.page_no + 1, this.state.type, this.state.campaign_id, this.state.agent_id, this.state.start, this.state.end);
            this.setState({page_no: this.state.page_no + 1});
        }
        // this.setState({isRendering: false});
    };

    showActivityDetail(data) {
        this.props.navigation.navigate('ReportDetail', {
            type: this.state.type,
            campaign_id: this.state.campaign_id,
            agent_id: data.agent_id,
            start: this.state.start,
            end: this.state.end
        });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: bgContainer, padding: 15}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Loader loading={this.props.isLoading}/>

                {(() => {
                    if (this.state.agentData.agent) {
                        return (
                            <ListItem style={{marginLeft: 0, paddingRight: 0}}>
                                <Card>
                                    <CardItem>
                                        <Body>
                                        <TouchableOpacity
                                            onPress={() => this.showActivityDetail(this.state.agentData)}>
                                            <Text style={{width: '80%'}}>{this.state.agentData.agent}</Text>
                                            <Text note>{this.state.agentData.agent_id}</Text>
                                        </TouchableOpacity>
                                        <Badge style={{backgroundColor: bgHeader, position:'absolute', right: 20, top: 5}}>
                                            <Text style={{fontSize: 13}}>{this.state.agentData.count}</Text>
                                        </Badge>
                                        </Body>
                                    </CardItem>
                                </Card>
                            </ListItem>
                        )
                    }
                })()}

                {(() => {
                    if (this.state.dataSource.length == 0 && !this.props.isLoading) {
                        return (
                            <Text style={{textAlign: 'center', marginTop: 50}}>There are no reports.</Text>
                        );
                    } else {
                        return (
                            <ListView
                                dataSource={this.state.data}
                                renderRow={data => {
                                    return (
                                        <Card>
                                            <CardItem style={{width: '100%'}}>
                                                <Body>
                                                    <TouchableOpacity
                                                        onPress={() => this.showActivityDetail(data)}>
                                                        <Text  style={{width: width - 150}}>{data.agent}</Text>
                                                        <Text note>{data.agent_id}</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        onPress={() => this.props.navigation.navigate('CampaignDetail', {
                                                            type: this.state.type,
                                                            campaign_id: this.state.campaign_id,
                                                            agent_id: data.agent_id,
                                                        })}
                                                        style={{position: 'absolute', top: 0, right: 0, width: 80, height: 50}}>
                                                        <Badge style={{backgroundColor: bgHeader, right: 20, top: 5, position: 'absolute'}}>
                                                            <Text style={{fontSize: 13}}>{data.count}</Text>
                                                        </Badge>
                                                        <Icon name="ios-arrow-forward"
                                                              style={{right: 5, top: 10, fontSize: 20, position: 'absolute'}}/>
                                                    </TouchableOpacity>
                                                </Body>
                                            </CardItem>
                                        </Card>
                                    );
                                }}
                                onEndReachedThreshold={20}
                                onEndReached={this.loadMoreActivity.bind(this)}
                            />
                        );
                    }
                })()}


            </View>
        )
    }
}

CampaignDetail.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>

            <Title style={{width: 200, color: '#fff'}}>Activity Detail</Title>
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
        getAgentReportList: (page_no, type, campaign_id, agent_id, start, end) => {
            dispatch(getRequest(Config.ACTIVITY_REPORT_LIST_URL + '?page_no=' + page_no + '&type=' + type + '&campaign_id=' + campaign_id + '&agent_id=' + agent_id + '&start=' + start + '&end=' + end, 'agent_report_list_' + agent_id));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CampaignDetail);