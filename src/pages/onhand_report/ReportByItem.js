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


class ReportByItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            isRendering: true,
            page_no: 1,
            item_id: '',
            itemData: {},
            canLoadMoreContent: false,
            viewMore: false
        };
    }

    componentDidMount() {
        console.log('home-did-mount');
        let itemId = this.props.navigation.getParam('item_id', 1);
        let itemData = this.props.navigation.getParam('item_data', {});
        this.setState({isRendering: true, item_id: itemId, itemData: itemData});
        this.props.getOnHandReportByItemList(this.state.page_no, itemId);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null && nextProps.requestType == 'onhand_report_by_item') {
            this.setState({data: this.getUpdatedDataSource(nextProps)});
            if (nextProps.data.length < 20) {
                this.setState({canLoadMoreContent: false})
            }else {
                this.setState({canLoadMoreContent: true})
            }
        }
    }

    getUpdatedDataSource(props) {
        let rows = this.state.dataSource.concat(props.data);
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
            this.props.getOnHandReportByItemList(this.state.page_no + 1, this.state.item_id);
            this.setState({page_no: this.state.page_no + 1});
        }
        // this.setState({isRendering: false});
    };

    showActivityDetail(data) {
        // this.props.navigation.navigate('CampaignDetail', {campaign_id: data.id, agent_id: '', type: this.state.type});
        this.props.navigation.navigate('ReportByItemDetail', {item_data: this.state.itemData, agent_data: data});
    }

    viewMore() {
        let viewMore = this.state.viewMore;
        this.setState({viewMore: !viewMore});
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
                                <View style={{height: 30}}>
                                    <Grid>
                                        <Col>
                                            <Text>Item: {this.state.itemData.item}</Text>
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
                            <ListView
                                dataSource={this.state.data}
                                renderRow={data => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => this.showActivityDetail(data)}>
                                            <Card>
                                            <CardItem>
                                                <Body>
                                                    <Grid>
                                                        <Col>
                                                            <Text>{data.agent}</Text>
                                                        </Col>
                                                    </Grid>
                                                    <Grid>
                                                        <Col>
                                                            <Text note style={{fontSize: 12}}>Uninvoiced: {data.uninvoiced_onhand}</Text>
                                                        </Col>
                                                        <Col>
                                                            <Text note style={{fontSize: 12}}>This Week: {data.this_week}</Text>
                                                        </Col>
                                                    </Grid>
                                                    <Grid>
                                                        <Col>
                                                            <Text note style={{fontSize: 12}}>Invoiced: {data.invoiced_onhand}</Text>
                                                        </Col>
                                                        <Col>
                                                            <Text note style={{fontSize: 12}}>Next Week: {data.next_week}</Text>
                                                        </Col>
                                                    </Grid>
                                                    <Grid>
                                                        <Col>
                                                            <Text note style={{fontSize: 12}}>Total: {data.total_onhand}</Text>
                                                        </Col>
                                                        <Col>
                                                            <Text note style={{fontSize: 12}}>Week After Next: {data.week_after_next}</Text>
                                                        </Col>
                                                    </Grid>
                                                    <Icon name="ios-arrow-forward"
                                                          style={{position: 'absolute', right: 5, top: 30, fontSize: 20}}/>
                                                </Body>
                                            </CardItem>
                                            </Card>
                                        </TouchableOpacity>
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

ReportByItem.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Report List by Item</Title>
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
        getOnHandReportByItemList: (page_no, item_id) => {
            dispatch(getRequest(Config.ONHAND_REPORT_DETAIL_LIST_URL + '?page_no=' + page_no + '&item_id=' + item_id, 'onhand_report_by_item'));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportByItem);