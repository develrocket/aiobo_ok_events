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
import DatePicker from 'react-native-datepicker';
import {Platform} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';

let {width} = Dimensions.get('window');


class ActivityReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            isRendering: true,
            page_no: 1,
            type: 13,
            iosType: 'Today Approved',
            canLoadMoreContent: false,
            start: '',
            end: ''
        };
    }

    componentDidMount() {
        console.log('home-did-mount');
        this.setState({isRendering: true});
        this.props.getCampaignReportList(this.state.page_no, 13, this.state.start, this.state.end);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null && nextProps.requestType == 'campaign_report_list') {
            this.setState({data: this.getUpdatedDataSource(nextProps)});
            if (nextProps.data.length < 20) {
                this.setState({canLoadMoreContent: false})
            } else {
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
            this.props.getCampaignReportList(this.state.page_no + 1, this.state.type, this.state.start, this.state.end);
            this.setState({page_no: this.state.page_no + 1});
        }
        // this.setState({isRendering: false});
    };

    showActivityDetail(data) {
        this.props.navigation.navigate('CampaignDetail', {campaign_id: data.id, agent_id: '', type: this.state.type, start: this.state.start, end: this.state.end});
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: bgContainer, padding: 15}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Loader loading={this.props.isLoading}/>

                {(() => {
                    if (Platform.OS == 'ios') {
                        let data = [{
                            value: 'Today Approved',
                        }, {
                            value: 'Today Created',
                        }, {
                            value: 'Yesterday Approved',
                        }, {
                            value: 'Yesterday Created',
                        }, {
                            value: 'Current Week Approved',
                        }, {
                            value: 'Current Week Created',
                        }, {
                            value: 'Current Month Approved',
                        }, {
                            value: 'Current Month Created',
                        }, {
                            value: 'Last Week Approved',
                        }, {
                            value: 'Last Week Created',
                        }, {
                            value: 'Last Month Approved',
                        }, {
                            value: 'Last Month Created',
                        }, {
                            value: 'Custom Approved',
                        }, {
                            value: 'Custom Created',
                        }];

                        let values = [
                            'Last Month Created',
                            'Current Month Created',
                            'Last Week Created',
                            'Current Week Created',
                            'Yesterday Created',
                            'Today Created',
                            'Custom Created',
                            'Last Month Approved',
                            'Current Month Approved',
                            'Last Week Approved',
                            'Current Week Approved',
                            'Yesterday Approved',
                            'Today Approved',
                            'Custom Approved'
                        ];

                        return (
                            <View style={{width: '100%', height: 50, marginBottom: 20}}>
                                <Grid>
                                    <Col>
                                        <Text
                                            style={{fontSize: 23, paddingLeft: 0, color: '#444444', marginTop: 30, marginLeft: 10}}>Reports</Text>
                                    </Col>
                                    <Col>
                                        <Dropdown
                                            data={data}
                                            itemCount={14}
                                            value={this.state.iosType}
                                            pickerStyle={{top: 100, transform:[{translateY: 0}]}}
                                            onChangeText={(value) => {
                                                let type = values.indexOf(value) + 1;
                                                this.setState({type: type, dataSource: [], page_no: 1, canLoadMoreContent: true, iosType: value});
                                                this.props.getCampaignReportList(1, type, this.state.start, this.state.end);
                                            }}
                                        />
                                    </Col>
                                </Grid>
                            </View>
                        );
                    }else {
                        return (
                            <View style={{width: '100%', height: 50, marginBottom: 10}}>
                                <Grid>
                                    <Col>
                                        <Text
                                            style={{fontSize: 23, paddingLeft: 0, color: '#444444', marginTop: 5, marginLeft: 10}}>Reports</Text>
                                    </Col>
                                    <Col>
                                        <Picker
                                            note
                                            mode="dropdown"
                                            style={{
                                                width: 220, marginLeft: -40, transform: [
                                                    {scaleX: 0.8},
                                                    {scaleY: 0.8},
                                                ]
                                            }}
                                            selectedValue={this.state.type}
                                            onValueChange={(value) => {
                                                this.setState({type: value, dataSource: [], page_no: 1, canLoadMoreContent: true});
                                                this.props.getCampaignReportList(1, value, this.state.start, this.state.end);
                                            }}>
                                            <Picker.Item label={'Today Approved'} value={13}/>
                                            <Picker.Item label={'Today Created'} value={6}/>
                                            <Picker.Item label={'Yesterday Approved'} value={12}/>
                                            <Picker.Item label={'Yesterday Created'} value={5}/>
                                            <Picker.Item label={'Current Week Approved'} value={11}/>
                                            <Picker.Item label={'Current Week Created'} value={4}/>
                                            <Picker.Item label={'Current Month Approved'} value={9}/>
                                            <Picker.Item label={'Current Month Created'} value={2}/>
                                            <Picker.Item label={'Last Week Approved'} value={10}/>
                                            <Picker.Item label={'Last Week Created'} value={3}/>
                                            <Picker.Item label={'Last Month Approved'} value={8}/>
                                            <Picker.Item label={'Last Month Created'} value={1}/>
                                            <Picker.Item label={'Custom Approved'} value={14}/>
                                            <Picker.Item label={'Custom Created'} value={7}/>
                                        </Picker>
                                    </Col>
                                </Grid>
                            </View>
                        );
                    }
                })()}

                {(() => {
                    if (this.state.type == 14 || this.state.type == 7) {
                        return (
                            <View style={{width: '100%', height: 50, marginBottom: 10}}>
                                <Grid>
                                    <Col>
                                        <DatePicker
                                            style={{width: '100%'}}
                                            date={this.state.start}
                                            mode="date"
                                            placeholder="start date"
                                            format="YYYY-MM-DD"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 5,
                                                    top: 9,
                                                    marginLeft: 0,
                                                    height: 25
                                                },
                                                dateInput: {
                                                    marginLeft: 36,
                                                    borderWidth: 0,
                                                    borderBottomWidth: 1
                                                }
                                            }}
                                            onDateChange={(date) => {
                                                this.setState({start: date, dataSource: []});
                                                this.props.getCampaignReportList(1, this.state.type, date, this.state.end);
                                            }}
                                        />
                                    </Col>
                                    <Col>
                                        <DatePicker
                                            style={{width: '100%'}}
                                            date={this.state.end}
                                            mode="date"
                                            placeholder="end date"
                                            format="YYYY-MM-DD"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 5,
                                                    top: 9,
                                                    marginLeft: 0,
                                                    height: 25
                                                },
                                                dateInput: {
                                                    marginLeft: 36,
                                                    borderWidth: 0,
                                                    borderBottomWidth: 1
                                                }
                                            }}
                                            onDateChange={(date) => {
                                                this.setState({end: date, dataSource: []});
                                                this.props.getCampaignReportList(1, this.state.type, this.state.start, date);
                                            }}
                                        />
                                    </Col>
                                </Grid>
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
                                <ListView
                                    dataSource={this.state.data}
                                    renderRow={data => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => this.showActivityDetail(data)}>
                                                <Card>
                                                    <CardItem style={{width: '100%'}}>
                                                        <Body>
                                                        <Text style={{marginTop: 3}}>{data.name}</Text>
                                                        </Body>
                                                        <Right style={{flexDirection: 'row', height: 28}}>
                                                            <Badge style={{
                                                                backgroundColor: bgHeader,
                                                                position: 'absolute',
                                                                right: 20,
                                                                top: 1
                                                            }}>
                                                                <Text style={{fontSize: 13}}>{data.count}</Text>
                                                            </Badge>
                                                            <Icon name="ios-arrow-forward" style={{
                                                                position: 'absolute',
                                                                right: 5,
                                                                fontSize: 20,
                                                                top: 3
                                                            }}/>
                                                        </Right>
                                                    </CardItem>
                                                </Card>
                                            </TouchableOpacity>
                                        );
                                    }}
                                    onEndReachedThreshold={20}
                                    enableEmptySections={true}
                                    onEndReached={this.loadMoreActivity.bind(this)}
                                    style={{marginBottom: 50}}
                                />
                            </View>
                        );
                    }
                })()}


            </View>
        )
    }
}

ActivityReport.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="md-menu" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{color: '#ffffff', width: 200}}>Activity Report</Title>
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
        getCampaignReportList: (page_no, type, start, end) => {
            dispatch(getRequest(Config.ACTIVITY_CAMPAIGN_LIST_URL + '?page_no=' + page_no + '&type=' + type + '&start=' + start + '&end=' + end, 'campaign_report_list'));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityReport);