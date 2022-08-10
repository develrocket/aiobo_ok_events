import React, {Component} from 'react';
import {
    Container,
    Content,
} from 'native-base';
import {connect} from 'react-redux';
import {ScrollView, Text, TextInput, View, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, Platform} from 'react-native';
import {login} from '../../actions/auth';
import Config from 'react-native-config';
import Loader from '../../components/Loader';
import {postRequest} from "../../actions/Service";
import DialogInput from 'react-native-dialog-input';
import Dialog from "react-native-dialog";

let {height, width} = Dimensions.get('window');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            route: 'Login',
            email: '',
            password: '',
            promptVisible: false,
            forgotInfo: ''
        };
    }

    componentDidMount() {
        console.log(Config.API_URL);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null) {
            if (nextProps.requestType == 'login') {
                if (nextProps.data.result != 'success') {
                    setTimeout(() => {
                        Alert.alert(
                            'Failed',
                            nextProps.data.msg + '',
                            [
                                {
                                    text: 'OK', onPress: () => {
                                }
                                }
                            ],
                            {cancelable: true}
                        );
                    }, 100);
                }else {
                    this.props.didLogin(this.state.email, this.state.password, nextProps.data.token, nextProps.data.roles);
                }

            } else if (nextProps.requestType == 'forgot_password') {
                setTimeout(() => {
                    Alert.alert(
                        'Success',
                        nextProps.data.msg + '',
                        [
                            {
                                text: 'OK', onPress: () => {
                            }
                            }
                        ],
                        {cancelable: true}
                    );
                }, 100);
            }
        }

        if (nextProps.error != undefined) {
            if (nextProps.requestType == 'login') {
                setTimeout(() => {
                    Alert.alert(
                        'Error',
                        'Invalid email or password.',
                        [
                            {
                                text: 'OK', onPress: () => {
                            }
                            }
                        ],
                        {cancelable: true}
                    )
                }, 100);
            } else {
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
    }

    userLogin(e) {
        this.props.onLogin(this.state.email, this.state.password);
        e.preventDefault();
    }

    render() {
        return (
            <Container>
                <Image style={{width: width, height: height, position: 'absolute', top: 0, left: 0}}
                       source={require('../../imgs/background.png')}/>
                <Content>
                    <Loader loading={this.props.isLoading}/>
                    <View style={{flex: 1, backgroundColor: 'transparent'}}>
                        <ScrollView style={styles.container}>
                            <View>
                                <Image
                                    source={require('../../imgs/logo.png')}
                                    style={styles.imgLogo}
                                />
                            </View>
                            <View style={{marginTop: 80}}>
                                <View style={styles.iconInputBox}>
                                    <Image source={require('../../imgs/user_icon.png')} style={styles.inputIcon}/>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Email'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={true}
                                        keyboardType='email-address'
                                        value={this.state.username}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) => this.setState({email: text})}/>
                                </View>

                                <View style={styles.iconInputBox}>
                                    <Image source={require('../../imgs/lock_icon.png')} style={styles.inputIcon}/>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Password'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        secureTextEntry={true}
                                        value={this.state.password}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) => this.setState({password: text})}/>
                                </View>


                                <View style={{margin: 7}}/>
                                <TouchableOpacity
                                    style={{backgroundColor: '#fff', paddingTop: 15, paddingBottom: 15}}
                                    onPress={(e) => this.userLogin(e)}
                                    underlayColor='#fff'>
                                    <Text style={{color: '#2f89d7', textAlign: 'center', fontSize: 18}}>Login</Text>
                                </TouchableOpacity>

                                <Text style={{color: '#ffffff', textAlign: 'center', marginTop: 20}}
                                      onPress={() => this.setState({promptVisible: true})}>
                                    Forgot password?
                                </Text>
                            </View>

                            <Dialog.Container visible={this.state.promptVisible}>
                                <Dialog.Title>Forgot Password?</Dialog.Title>
                                <Dialog.Description>
                                    Please input your email and submit.
                                </Dialog.Description>
                                <Dialog.Input
                                    onChangeText={inputText => this.setState({forgotInfo: inputText})}
                                    value={this.state.forgotInfo}>
                                </Dialog.Input>
                                <Dialog.Button label="Cancel" onPress={() => this.setState({promptVisible: false})}/>
                                <Dialog.Button label="Submit" onPress={() => {
                                    if (this.state.forgotInfo) {
                                        this.props.onForgotPassword(this.state.forgotInfo);
                                        this.setState({forgotInfo: ''});
                                        this.setState({promptVisible: false});
                                    }
                                }}/>
                            </Dialog.Container>
                        </ScrollView>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'transparent',
        flex: 1
    },
    imgLogo: {
        width: width - 80,
        marginLeft: 20,
        height: (width - 80) / 761 * 386,
        marginTop: 150
    },
    iconInputBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff',
        marginBottom: 15
    },
    inputIcon: {
        width: 20,
        height: 30
    },
    input: {
        flex: 1,
        paddingLeft: 0,
        color: '#ffffff',
        marginLeft: 10,
        borderBottomWidth: 0,
        ...Platform.select({
            android: {
                paddingTop: 10,
                paddingRight: 10,
                paddingBottom: 10,
            },
        }),
    },
});



const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (email, password) => {
            dispatch(postRequest(Config.LOGIN_URL, {email: email, password: password}, 'login'));
        },
        didLogin: (email, password, authToken, roles) => {
            dispatch(login(email, password, authToken, roles));
        },
        onForgotPassword: (email) => {
            dispatch(postRequest(Config.FORGOT_PASSWORD_URL, {email: email}, 'forgot_password'))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);