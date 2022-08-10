import React, {
    Component,
} from 'react'
import {
    View,
    Alert,
    ActivityIndicator,
} from 'react-native'
import {Header, Left, Body, Title, Right, Button, Container, Content} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Barcode from 'react-native-smart-barcode';
import TimerEnhance from 'react-native-smart-timer-enhance';
import s from './Style';
import {bgHeader, bgContainer} from "../styles";


class BarcodeTest extends Component {

    constructor (props) {
        super(props);
        this.state = {
            viewAppear: false,
        };
    }

    render () {

        return (
            <Container>
                <View style={{flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center',}}>
                    {this.state.viewAppear ? <Barcode style={{flex: 1, alignSelf: 'stretch', }}
                                                      ref={ component => this._barCode = component }
                                                      scannerRectHeight={120}
                                                      onBarCodeRead={this._onBarCodeRead}/> : null}

                    {!this.state.viewAppear ? this._renderActivityIndicator() : null}
                </View>
            </Container>
        )
    }

    componentDidMount () {
        this.props.navigation.addListener('didFocus', () => {
            this.setTimeout(() => {
                this.setState({
                    viewAppear: true,
                });
            }, 255);
        });
    }

    componentWillUnmount () {
        // this._listeners && this._listeners.forEach(listener => listener.remove());
    }

    _onBarCodeRead = (e) => {
        console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`)
        this._stopScan();
        this.props.navigation.state.params.onScanBarcode(e.nativeEvent.data.code);
        this.props.navigation.goBack();
        // Alert.alert(e.nativeEvent.data.type, e.nativeEvent.data.code, [
        //     { text: 'OK', onPress: () => this._startScan() },
        // ])
    };

    _startScan = (e) => {
        this._barCode.startScan()
    };

    _stopScan = (e) => {
        this._barCode.stopScan()
    };

    _renderActivityIndicator () {
        return (
            <ActivityIndicator
                style={{position: 'relative', left: 1, top: 1,}}
                animating={true}
                size={'large'}/>
        );
    }
}

BarcodeTest.navigationOptions = ({ navigation }) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Scan Barcode</Title>
            </Body>
            <Right/>
        </Header>
    )
});

export default TimerEnhance(BarcodeTest)