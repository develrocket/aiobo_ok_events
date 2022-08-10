import React, {Component} from 'react';
import {
    Button,
    Header,
    Left,
    Body,
    Title,
    Right
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import {
    Dimensions,
    StyleSheet,
    View
} from 'react-native';
import Pdf from 'react-native-pdf';

let {width} = Dimensions.get('window');


class PdfReader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filePath: ''
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.getParam('file_path', ''));
        this.setState({
            filePath: this.props.navigation.getParam('file_path', '')
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Pdf
                    source={{uri: this.state.filePath}}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    style={styles.pdf}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: width,
    }
});

PdfReader.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Pdf Reader</Title>
            </Body>
            <Right></Right>
        </Header>
    )
});

export default PdfReader;