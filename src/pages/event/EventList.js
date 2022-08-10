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
    Platform
} from 'react-native';
import {bgHeader, bgContainer} from "../../styles";
import {Col, Row, Grid} from 'react-native-easy-grid';

let {width} = Dimensions.get('window');


class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            isRendering: true,
            page_no: 1,
            canLoadMoreContent: false,
            eventType: 4
        };
    }

    componentDidMount() {
        this.setState({isRendering: true});
        this.props.getEventList(this.state.eventType, this.state.page_no);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data !== null && nextProps.requestType === 'event_list') {
            this.setState({data: this.getUpdatedDataSource(nextProps)});
            if (nextProps.data.length < 20) {
                this.setState({canLoadMoreContent: false})
            }else {
                this.setState({canLoadMoreContent: true})
            }
        } else if (nextProps.data !== null && nextProps.requestType === 'reload_event_list') {
            this.setState({data: this.getUpdatedDataSource(nextProps, true)});
            if (nextProps.data.length < 20) {
                this.setState({canLoadMoreContent: false})
            }else {
                this.setState({canLoadMoreContent: true})
            }
        }
    }

    getUpdatedDataSource(props, isReload = false) {
        let rows = this.state.dataSource.concat(props.data);
        this.setState({dataSource: rows});
        if (isReload) {
            rows = props.data;
            this.setState({dataSource: rows});
        }
        let ids = rows.map((obj, index) => index);
        return this.state.data.cloneWithRows(rows, ids);
    }

    _rowHasChanged(r1, r2) {
        // You might want to use a different comparison mechanism for performance.
        return JSON.stringify(r1) !== JSON.stringify(r2);
    }

    loadMoreEvent = async () => {
        if (this.state.canLoadMoreContent) {
            this.props.getEventList(this.state.eventType, this.state.page_no + 1);
            this.setState({page_no: this.state.page_no + 1});
        }
    };

    getWeekdaysString(data) {
        if (!data) return '';
        let weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        let values = data.split(',');
        let valueArray = [];
        for (let i = 0; i < values.length; i ++) {
            valueArray.push(weekdays[values[i] - 1]);
        }
        return valueArray.join(',');
    }

    showEventDetail(data) {
        this.props.navigation.navigate('ViewEvent', {event: data});
    }

    updateType(value) {
        this.setState({eventType: value, dataSource: [], page_no: 1, canLoadMoreContent: true});
        this.props.getEventList(value, 1);
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: bgContainer, paddingBottom: 15}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Loader loading={this.props.isLoading}/>

                {(() => {
                    if (this.state.dataSource.length === 0 && !this.props.isLoading) {
                        return (
                            <Text style={{textAlign: 'center', marginTop: 50}}>There are no events.</Text>
                        );
                    } else {
                        return (
                            <ListView
                                style={{padding: 15}}
                                dataSource={this.state.data}
                                renderRow={data => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => this.showEventDetail(data)}>
                                            <Card>
                                            <CardItem>
                                                <Body>
                                                    <Grid>
                                                        <Col>
                                                            <Text>Location: {data.location_name}</Text>
                                                        </Col>
                                                    </Grid>
                                                    <Grid>
                                                        <Col>
                                                            <Text note style={{fontSize: 12}}>Start Time: {data.start_time}</Text>
                                                        </Col>
                                                        <Col>
                                                            <Text note style={{fontSize: 12}}>End Time: {data.end_time}</Text>
                                                        </Col>
                                                    </Grid>
                                                    <Grid>
                                                        <Col>
                                                            <Text note style={{fontSize: 12}}>Setup Type: {data.setup_type_name}</Text>
                                                        </Col>
                                                    </Grid>
                                                    <Icon name="ios-arrow-forward"
                                                          style={{position: 'absolute', right: 5, top: 20, fontSize: 20}}/>
                                                </Body>
                                            </CardItem>
                                            </Card>
                                        </TouchableOpacity>
                                    );
                                }}
                                onEndReachedThreshold={20}
                                onEndReached={this.loadMoreEvent.bind(this)}
                            />
                        );
                    }
                })()}


            </View>
        )
    }
}

EventList.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="md-menu" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Event List</Title>
            </Body>
            <Right></Right>
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
        getEventList: (type, page_no) => {
            dispatch(getRequest(Config.EVENT_LIST_URL + '?page_no=' + page_no + '&type=' + type, 'event_list'));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);