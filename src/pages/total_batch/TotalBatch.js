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
} from 'react-native';
import {bgHeader, bgContainer} from "../../styles";
import {Col, Row, Grid} from 'react-native-easy-grid';

let {width} = Dimensions.get('window');


class TotalBatch extends Component {
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
        this.setState({isRendering: true});
        this.props.getBatchList(this.state.page_no);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null && nextProps.requestType == 'total_batch_list') {
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

    loadMoreBatch = async () => {
        if (this.state.canLoadMoreContent) {
            this.props.getBatchList(this.state.page_no + 1);
            this.setState({page_no: this.state.page_no + 1});
        }
        // this.setState({isRendering: false});
    };

    showBatchDetail(batch) {
        this.props.navigation.navigate('BatchDetail', {batch_data: batch});
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: bgContainer}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Loader loading={this.props.isLoading}/>

                {(() => {
                    if (this.state.dataSource.length == 0 && !this.props.isLoading) {
                        return (
                            <Text style={{textAlign: 'center', marginTop: 50}}>There are no Batches.</Text>
                        );
                    } else {
                        return (
                            <ListView
                                dataSource={this.state.data}
                                renderRow={data => {
                                    return (
                                        <ListItem>
                                            <Body>
                                            <Text onPress={() => this.showBatchDetail(data)}>Batch ID: {data.batch_id}</Text>
                                            <Text note style={{fontSize: 10}} onPress={() => this.showBatchDetail(data)}>End Date: {data.end_date}</Text>
                                            </Body>
                                            <Right style={{flexDirection: 'row'}}>
                                                <Text style={{fontSize: 13}}
                                                      onPress={() => this.showBatchDetail(data)}>{(data.amount * 1).toFixed(2)}</Text>
                                                <Icon name="ios-arrow-forward" style={s.itemDetailIcon} onPress={() => this.showBatchDetail(data)}/>
                                            </Right>
                                        </ListItem>
                                    );
                                }}
                                onEndReachedThreshold={20}
                                onEndReached={this.loadMoreBatch.bind(this)}
                            />
                        );
                    }
                })()}


            </View>
        )
    }
}

TotalBatch.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="md-menu" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Total By Batch</Title>
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
        getBatchList: (page_no) => {
            dispatch(getRequest(Config.TOTAL_BATCH_URL + '?page_no=' + page_no, 'total_batch_list'));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TotalBatch);