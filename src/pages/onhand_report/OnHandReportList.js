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


class OnHandReportList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            isRendering: true,
            page_no: 1,
            canLoadMoreContent: false
        };
    }

    componentDidMount() {
        console.log('home-did-mount');
        this.setState({isRendering: true});
        this.props.getOnHandReportList(this.state.page_no);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null && nextProps.requestType == 'onhand_report_list') {
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
            this.props.getOnHandReportList(this.state.page_no + 1);
            this.setState({page_no: this.state.page_no + 1});
        }
        // this.setState({isRendering: false});
    };

    showActivityDetail(data) {
        this.props.navigation.navigate('ReportByItem', {item_id: data.item_id, item_data: data});
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
                                                            <Text>{data.item}</Text>
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

OnHandReportList.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="md-menu" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Onhand Report List</Title>
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
        getOnHandReportList: (page_no) => {
            dispatch(getRequest(Config.ONHAND_REPORT_LIST_URL + '?page_no=' + page_no, 'onhand_report_list'));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OnHandReportList);