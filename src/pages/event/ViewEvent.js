import React, {Component} from 'react';
import {
    Button,
    Container,
    Content,
    Header,
    Left,
    Body,
    Right,
    Title,
    Form,
    Item,
    Label,
    Input,
    Text,
    View,
    ListItem,
    CheckBox
} from 'native-base';
import {Image, Dimensions, Alert, TouchableOpacity, Keyboard, Platform, StyleSheet, Picker} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import {getRequest, postRequest, formRequest} from "../../actions/Service";
import Loader from '../../components/Loader';
import {bgHeader, bgContainer} from "../../styles";
import {TextInputMask} from 'react-native-masked-text';
import DatePicker from 'react-native-datepicker';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import {Col, Row, Grid} from 'react-native-easy-grid';
import ImagePicker from 'react-native-image-picker';

let {width} = Dimensions.get('window');

class ViewEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitted: false,
            locationList: [],
            setupTypes: [],
            docTypes: [],
            location_id: '',
            location_name: '',
            start_time: '',
            end_type: '',
            setup_type_id: '',
            setup_type_name: '',
            documentList: [],
            showWeekDays: false,
            event_id: ''
        };
    }

    componentDidMount() {
        console.log(this.props);

        let event = this.props.navigation.getParam('event', {});

        if (Object.keys(event).length > 0) {
            this.setState({
                event_id: event.id,
                location_id: event.location_id,
                location_name: event.location_name,
                start_time: event.start_time,
                end_time: event.end_time,
                setup_type_id: event.setup_type,
                setup_type_name: event.setup_type_name
            });
            let documents = [];
            for (let i = 0; i < event.docs.length; i ++) {
                let doc = event.docs[i];
                let fileExt = doc.server_name.substring(doc.server_name.lastIndexOf('.') + 1);
                let fileType = 'image';
                if (fileExt.toLowerCase() === 'pdf') {
                    fileType = 'pdf';
                }
                documents.push ({
                    doc_type_id: doc.id,
                    doc_type_name: doc.requirement_name,
                    content: {
                        name: '',
                        type: '',
                        uri: ''
                    },
                    fileName: doc.original_name,
                    filePath: doc.server_name,
                    fileType: fileType
                })
            }
            this.setState({documentList: documents})
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data !== null) {
            if (nextProps.requestType === 'location_list') {
                this.setState({locationList: this.props.locationList});
            } else if (nextProps.requestType === 'setup_types_list') {
                this.setState({setupTypes: this.props.setupTypes});
            } else if (nextProps.requestType === 'doc_types_list') {
                this.setState({docTypes: this.props.docTypes});
                // this.setDocumentList();
            } else if (nextProps.requestType === 'create_event') {
                if (nextProps.data.result === 'success') {
                    this.setState({isSubmitted: true})
                }else {
                    setTimeout(() => {
                        Alert.alert(
                            'Error',
                            nextProps.data.msg + '',
                            [
                                {
                                    text: 'OK', onPress: () => {
                                    this.props.createEvent(this.getEventData(0));
                                }
                                },
                                {
                                    text: 'Cancel', onPress: () => {}
                                }
                            ],
                            {cancelable: true}
                        )
                    }, 100);
                }
            }
        }

        if (nextProps.error !== undefined && nextProps.requestType === 'create_event') {
            setTimeout(() => {
                Alert.alert(
                    'Error',
                    nextProps.error.response.data + '',
                    [
                        {
                            text: 'OK', onPress: () => {
                            }
                        }
                    ],
                    {cancelable: true}
                )
            }, 100);
        }
    }

    openPdf(filePath) {
        let fileExt = filePath.substring(filePath.lastIndexOf(".") + 1);
        if (fileExt.toLowerCase() === 'pdf') {
            this.props.navigation.navigate("PdfReader", {file_path: filePath});
        }
    }

    render() {

        return (
            <Container style={{backgroundColor: bgContainer}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Content padder style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20, paddingBottom: 20}}>
                    <Loader loading={this.props.isLoading}/>
                    <View>
                        <Form>
                            <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                <Label>
                                    Location *
                                </Label>
                                <Input style={{paddingLeft: 12}}
                                       value={this.state.location_name}
                                       underlineColorAndroid='transparent'
                                       textAlign={'center'}
                                       editable={false}/>
                            </Item>
                            <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                <Label>Start Time *</Label>
                                <Input style={{paddingLeft: 12}}
                                       value={this.state.start_time}
                                       underlineColorAndroid='transparent'
                                       textAlign={'center'}
                                       editable={false}/>
                            </Item>
                            <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                <Label>End Time *</Label>
                                <Input style={{paddingLeft: 12}}
                                       value={this.state.end_time}
                                       underlineColorAndroid='transparent'
                                       textAlign={'center'}
                                       editable={false}/>
                            </Item>
                            <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                <Label>
                                    Setup Type
                                </Label>
                                <Input style={{paddingLeft: 12}}
                                       value={this.state.setup_type_name}
                                       underlineColorAndroid='transparent'
                                       textAlign={'center'}
                                       editable={false}/>
                            </Item>
                            {
                                this.state.documentList.map((data, i) => (
                                    <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel key={i}>
                                        <Label style={{marginBottom: 20}}>
                                            Requirement: {data.doc_type_name}
                                        </Label>
                                        {(() => {
                                            if (data.content.type === 'image/jpg' || data.content.type === 'image/jpeg' || data.content.type === 'image/png') {
                                                return (
                                                    <Image style={{width: width - 100, height: 300, marginBottom: 10}} source={{uri: data.content.uri.replace('file://', ''), isStatic: true}} />
                                                )
                                            } else if (data.content.type !== '') {
                                                return (
                                                    <Button transparent onPress={() => this.openPdf(data.content.uri)}>
                                                        <Icon name="md-document" style={{fontSize: 20}} />
                                                        <Text style={{fontSize: 13}}>{' ' + data.content.name}</Text>
                                                    </Button>
                                                )
                                            }else {
                                                if (data.fileName) {
                                                    if (data.fileType === 'image') {
                                                        return (
                                                            <Image style={{width: width - 100, height: 300, marginBottom: 10}} source={{uri: data.filePath, isStatic: true}} />
                                                        )
                                                    }else {
                                                        return (
                                                            <Button transparent onPress={() => this.openPdf(data.filePath)}>
                                                                <Icon name="md-document" style={{fontSize: 20}} />
                                                                <Text style={{fontSize: 13}}>{' ' + data.fileName}</Text>
                                                            </Button>
                                                        )
                                                    }
                                                }
                                            }
                                        })()}

                                    </Item>
                                ))
                            }

                        </Form>
                    </View>
                </Content>
            </Container>
        )
    }
}

ViewEvent.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>View Event</Title>
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
    inputMask: {
        width: '100%',
        paddingLeft: 10,
        textAlign: 'center',
        ...Platform.select({
            ios: {
                height: 50
            },
            android: {
                paddingTop: 10,
            }
        }),
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType,
        locationList: state.service.locationList,
        setupTypes: state.service.setupTypes,
        docTypes: state.service.docTypes
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getLocationList: () => {
            dispatch(getRequest(Config.LOCATION_LIST_URL, 'location_list'));
        },
        getSetupTypes: () => {
            dispatch(getRequest(Config.SETUP_TYPES_LIST_URL, 'setup_types_list'));
        },
        getDocTypes: () => {
            dispatch(getRequest(Config.DOC_TYPES_LIST_URL, 'doc_types_list'));
        },
        createEvent: (data) => {
            dispatch(formRequest(Config.EVENT_LIST_URL + '/update', data, 'create_event'));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ViewEvent);