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
    Clipboard
} from 'react-native';
import {bgHeader, bgContainer} from "../../styles";
import {Col, Row, Grid} from 'react-native-easy-grid';
import Toast from 'react-native-simple-toast';

let {width} = Dimensions.get('window');


class ReportByItemDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            isRendering: true,
            page_no: 1,
            itemData: {},
            agentData: {},
            total_count: 0,
            canLoadMoreContent: false,
            viewMore: false
        };
    }

    componentDidMount() {
        console.log('home-did-mount');
        let itemData = this.props.navigation.getParam('item_data', {});
        let agentData = this.props.navigation.getParam('agent_data', {});
        this.setState({isRendering: true, itemData: itemData, agentData: agentData});
        this.props.getOnHandReportByItemDetailList(this.state.page_no, itemData.item_id, agentData.agent_id);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null && nextProps.requestType == 'onhand_report_by_item_detail') {
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
            this.props.getOnHandReportByItemDetailList(this.state.page_no + 1, this.state.itemData.item_id, this.state.agentData.agent_id);
            this.setState({page_no: this.state.page_no + 1});
        }
        // this.setState({isRendering: false});
    };

    viewMore() {
        let viewMore = this.state.viewMore;
        this.setState({viewMore: !viewMore});
    }

    _setContent(serial) {
        Clipboard.setString(serial);
        Toast.show('Serial is copied to clipboard.');
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: bgContainer, padding: 15}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Loader loading={this.props.isLoading}/>

                {(() => {
                    if (this.state.itemData.item) {
                        return (
                            <View style={{width: '100%', marginTop: 10, padding: 10}}>
                                <View style={{height: 50}}>
                                    <Grid>
                                        <Col>
                                            <Text>Item: {this.state.itemData.item}</Text>
                                            <Text>Agent: {this.state.agentData.agent}</Text>
                                        </Col>
                                    </Grid>
                                </View>

                                {(() => {
                                    if (this.state.viewMore) {
                                        return (
                                            <View style={{height: 80, marginBottom: 20}}>
                                                <Grid style={{borderBottomWidth: 1, borderBottomColor: '#888888', paddingBottom: 10}}>
                                                    <Col>
                                                        <Text note style={{fontSize: 12}}>Uninvoiced</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text note style={{fontSize: 12}}>Invoiced</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text note style={{fontSize: 12}}>Total</Text>
                                                    </Col>
                                                </Grid>
                                                <Grid>
                                                    <Col>
                                                        <Text style={{fontSize: 12}}>{this.state.itemData.uninvoiced_onhand}</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text style={{fontSize: 12}}>{this.state.itemData.invoiced_onhand}</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text style={{fontSize: 12}}>{this.state.itemData.total_onhand}</Text>
                                                    </Col>
                                                </Grid>
                                                <Grid style={{borderBottomWidth: 1, borderBottomColor: '#888888', paddingBottom: 10, marginTop: 20}}>
                                                    <Col>
                                                        <Text note style={{fontSize: 12}}>This Week</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text note style={{fontSize: 12}}>Next Week</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text note style={{fontSize: 12}}>After Next</Text>
                                                    </Col>
                                                </Grid>
                                                <Grid>
                                                    <Col>
                                                        <Text style={{fontSize: 12}}>{this.state.itemData.this_week}</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text style={{fontSize: 12}}>{this.state.itemData.next_week}</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text style={{fontSize: 12}}>{this.state.itemData.week_after_next}</Text>
                                                    </Col>
                                                </Grid>
                                            </View>
                                        )
                                    }
                                })()}
                                <TouchableOpacity onPress={() => this.viewMore()}>
                                    <Text style={{fontSize: 12, color: '#2f89d7'}}>{this.state.viewMore ? 'View Less' : 'View Detail'}</Text>
                                </TouchableOpacity>
                            </View>
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
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                    <Grid>
                                                        <Col>
                                                            <Text>
                                                                {data.serial}
                                                            </Text>
                                                            <Text note style={{fontSize: 12}}>Add Date: {data.add_date}</Text>
                                                            <Text note style={{fontSize: 12}}>Due Date: {data.due_date}</Text>
                                                            <Text note style={{fontSize: 12}}>Status: {data.status}</Text>
                                                            <TouchableOpacity
                                                                onPress={() => this._setContent(data.serial)}
                                                                style={{position: 'absolute', top: 5, right: 5}}>
                                                                <Icon name='ios-copy' style={{fontSize: 20}}/>
                                                            </TouchableOpacity>
                                                        </Col>
                                                    </Grid>
                                                    </Body>
                                                </CardItem>
                                            </Card>
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

ReportByItemDetail.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Report by Item Detail</Title>
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
        getOnHandReportByItemDetailList: (page_no, item_id, agent_id) => {
            dispatch(getRequest(Config.ONHAND_REPORT_DETAIL_URL + '?page_no=' + page_no + '&item_id=' + item_id + '&agent_id=' + agent_id, 'onhand_report_by_item_detail'));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportByItemDetail);