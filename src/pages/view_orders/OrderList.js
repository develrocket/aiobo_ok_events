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
import {getRequest} from "../../actions/Service";
import {
    ListView,
    View,
    Dimensions,
    Image,
    Platform,
    TouchableOpacity
} from 'react-native';
import {bgHeader, bgContainer} from "../../styles";
import {Col, Row, Grid} from 'react-native-easy-grid';

let {width} = Dimensions.get('window');


class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            isRendering: true,
            type: 1,
            page_no: 1,
            total_count: 0,
            canLoadMoreContent: false
        };
    }

    componentDidMount() {
        this.setState({isRendering: true});
        this.props.getOrderList(this.state.type, this.state.page_no);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null && nextProps.requestType == 'order_list') {
            this.setState({data: this.getUpdatedDataSource(nextProps), total_count: nextProps.data['count']});
            if (nextProps.data.orders.length < 20) {
                this.setState({canLoadMoreContent: false})
            }else {
                this.setState({canLoadMoreContent: true})
            }
        }
    }

    getUpdatedDataSource(props) {
        let rows = this.state.dataSource.concat(props.data['orders']);
        this.setState({dataSource: rows});
        let ids = rows.map((obj, index) => index);
        return this.state.data.cloneWithRows(rows, ids);
    }

    _rowHasChanged(r1, r2) {
        // You might want to use a different comparison mechanism for performance.
        return JSON.stringify(r1) !== JSON.stringify(r2);
    }

    loadMoreOrders = async () => {
        console.log('load-more-agent');
        if (this.state.canLoadMoreContent) {
            this.props.getOrderList(this.state.type, this.state.page_no + 1);
            this.setState({page_no: this.state.page_no + 1});
        }
        // this.setState({isRendering: false});
    };

    updateType(value) {
        this.setState({type: value, dataSource: [], page_no: 1, canLoadMoreContent: true});
        this.props.getOrderList(value, 1);
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: bgContainer}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Loader loading={this.props.isLoading}/>
                <Segment style={{backgroundColor: bgHeader}}>
                    <Button first onPress={() => this.updateType(1)} active={this.state.type == 1}>
                        <Text style={{fontSize: 12, color: this.state.type == 1 && Platform.OS == 'android' ? bgHeader : '#fff'}}>Processing</Text>
                    </Button>
                    <Button onPress={() => this.updateType(2)} active={this.state.type == 2}>
                        <Text style={{fontSize: 12, color: this.state.type == 2 && Platform.OS == 'android' ? bgHeader : '#fff'}}>Shipped</Text>
                    </Button>
                    <Button onPress={() => this.updateType(3)} active={this.state.type == 3}>
                        <Text style={{fontSize: 12, color: this.state.type == 3 && Platform.OS == 'android' ? bgHeader : '#fff'}}>Complete</Text>
                    </Button>
                </Segment>


                {(() => {
                    if (this.state.dataSource.length == 0 && !this.props.isLoading) {
                        return (
                            <Text style={{textAlign: 'center', marginTop: 50}}>There are no orders.</Text>
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
                                                onPress={() => this.props.navigation.navigate('OrderDetail', {order_data: data})}>
                                                <Card>
                                                    <CardItem bordered>
                                                        <Body>
                                                        <Grid>
                                                            <Col style={{width: 120}}>
                                                                <Text note>Invoice #: </Text>
                                                            </Col>
                                                            <Col>
                                                                <Text>{data.invmast_id}</Text>
                                                            </Col>
                                                        </Grid>
                                                        <Grid>
                                                            <Col style={{width: 120}}>
                                                                <Text note>Add Date: </Text>
                                                            </Col>
                                                            <Col>
                                                                <Text>{data.add_date}</Text>
                                                            </Col>
                                                        </Grid>
                                                        <Grid>
                                                            <Col style={{width: 120}}>
                                                                <Text note>Price: </Text>
                                                            </Col>
                                                            <Col>
                                                                <Text>${data.price}</Text>
                                                            </Col>
                                                        </Grid>
                                                        </Body>
                                                    </CardItem>
                                                </Card>
                                            </TouchableOpacity>
                                        );
                                    }}
                                    onEndReachedThreshold={20}
                                    onEndReached={this.loadMoreOrders.bind(this)}
                                />
                            </View>
                        );
                    }
                })()}


            </View>
        )
    }
}

OrderList.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="md-menu" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Order List</Title>
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
        getOrderList: (type, page_no) => {
            dispatch(getRequest(Config.ORDER_LIST_URL + '?type=' + type + '&page_no=' + page_no, 'order_list'));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);