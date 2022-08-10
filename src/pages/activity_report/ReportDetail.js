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
    TouchableOpacity
} from 'react-native';
import {bgHeader, bgContainer} from "../../styles";
import {Col, Row, Grid} from 'react-native-easy-grid';

let {width} = Dimensions.get('window');


class ReportDetail extends Component {
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
            total_count: 0,
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
        this.setState({
            isRendering: true,
            campaign_id: campaignId,
            agent_id: agentId,
            type: type,
            start: start,
            end: end
        });
        this.props.getReportDetailList(this.state.page_no, type, campaignId, agentId, start, end);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null && nextProps.requestType == 'report_detail_list') {
            this.setState({data: this.getUpdatedDataSource(nextProps), total_count: nextProps.data['count']});
            if (nextProps.data.reports.length < 20) {
                this.setState({canLoadMoreContent: false})
            }else {
                this.setState({canLoadMoreContent: true})
            }
        }
    }

    getUpdatedDataSource(props) {
        let rows = this.state.dataSource.concat(props.data['reports']);
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
            this.props.getReportDetailList(this.state.page_no + 1, this.state.type, this.state.campaign_id, this.state.agent_id, this.state.start, this.state.end);
            this.setState({page_no: this.state.page_no + 1});
        }
        // this.setState({isRendering: false});
    };

    showActivityDetail(batch) {
        this.props.navigation.navigate('ItemDetail', {report_data: batch});
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: bgContainer, padding: 15}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Loader loading={this.props.isLoading}/>

                {(() => {
                    if (this.state.dataSource.length == 0 && !this.props.isLoading) {
                        return (
                            <Text style={{textAlign: 'center', marginTop: 50}}>There are no reports.</Text>
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
                                            <TouchableOpacity
                                                onPress={() => this.showActivityDetail(data)}>
                                                <Card>
                                                    <CardItem style={{width: '100%'}}>
                                                        <Body>
                                                        <Text>Order #: {data.order_number}</Text>
                                                        <Text note>Serial: {data.serial}</Text>
                                                        <Text note>Status: {data.status}</Text>
                                                        <Icon name="ios-arrow-forward" style={{position: 'absolute', right: 5, top: 20, fontSize: 20}}/>
                                                        </Body>
                                                    </CardItem>
                                                </Card>
                                            </TouchableOpacity>
                                        );
                                    }}
                                    onEndReachedThreshold={20}
                                    onEndReached={this.loadMoreActivity.bind(this)}
                                />
                            </View>
                        );
                    }
                })()}


            </View>
        )
    }
}

ReportDetail.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Report Detail</Title>
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
        getReportDetailList: (page_no, type, campaign_id, agent_id, start, end) => {
            dispatch(getRequest(Config.ACTIVITY_REPORT_DETAIL_URL + '?page_no=' + page_no + '&type=' + type + '&campaign_id=' + campaign_id + '&agent_id=' + agent_id + '&start=' + start + '&end=' + end, 'report_detail_list'));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportDetail);