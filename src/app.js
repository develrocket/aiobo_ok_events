import React, {Component} from 'react';
import {connect} from 'react-redux';
import Login from './pages/auth/login';
import Start from './pages/Start';
import Home from './pages/home';
import axios from 'react-native-axios';
import {NetInfo, AppState} from 'react-native';
import {getRequest, networkStatus, postRequest} from "./actions/Service";
import Config from 'react-native-config';
import {logout} from "./actions/auth";
import BackgroundGeolocation from "react-native-background-geolocation";

class App extends Component {

    state = {
        appState: AppState.currentState
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log('app-mount');
        NetInfo.fetch().done((reach) => {
            console.log('Initial: ' + reach);
            this.props.changeNetworkStatus(reach != 'NONE');
        });
        NetInfo.addEventListener(
            'change',
            this.handleFirstConnectivityChange.bind(this)
        );

        if (this.props.authToken != '') {
            axios.defaults.headers.common['AIOBO-TOKEN'] = this.props.authToken;
        }

        if (this.props.authToken != '') {
            this.configBackgroundTask();
            this.interval = setInterval(() => this.props.getLoginStatus(), 300000);
        }

        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data !== null) {
            console.log(nextProps.data);
            if (nextProps.requestType === 'share_location') {
                if (nextProps.data.result === 'logout') {
                    if (this.interval) {
                        clearInterval(this.interval);
                    }
                    this.props.logout();
                }
            } else if (nextProps.requestType === 'login') {
                if (nextProps.data.result === 'success') {
                    if (!this.interval) {
                        setTimeout(() => {
                            this.interval = setInterval(() => this.props.getLoginStatus(), 300000);
                            this.configBackgroundTask();
                        }, 1000);
                    }
                    navigator.geolocation.getCurrentPosition((position) => {
                        console.log('get-current-location');
                        this.uploadCurrentLocation(position.coords);
                    });
                }
            } else if (nextProps.requestType === 'login_status') {
                if (nextProps.data.is_active !== 1) {
                    this.props.logout();
                    if (this.interval) {
                        clearInterval(this.interval);
                    }
                }
            }
        }

        // if (nextProps.authToken != '' && !this.interval) {
        //     this.configBackgroundTask();
        //     this.interval = setInterval(() => this.props.getLoginStatus(), 300000);
        // } else {
        //     if (this.interval) {
        //         clearInterval(this.interval);
        //     }
        //     this.inverval = null;
        //     console.log(this.interval);
        //     BackgroundGeolocation.removeListeners();
        // }
    }

    configBackgroundTask() {

        console.log('config-background-task');
        console.log(this.props.authToken);
        ////
        // 1.  Wire up event-listeners
        //

        // This handler fires whenever bgGeo receives a location update.
        BackgroundGeolocation.onLocation(this.onLocation.bind(this), this.onError);

        // This handler fires when movement states changes (stationary->moving; moving->stationary)
        BackgroundGeolocation.onMotionChange(this.onMotionChange);

        // This event fires when a change in motion activity is detected
        BackgroundGeolocation.onActivityChange(this.onActivityChange);

        // This event fires when the user toggles location-services authorization
        BackgroundGeolocation.onProviderChange(this.onProviderChange);

        ////
        // 2.  Execute #ready method (required)
        //
        BackgroundGeolocation.configure({
            // Geolocation Config
            reset: true,
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,
            // Activity Recognition
            stopTimeout: 1,
            // Application config
            debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            startForeground: true,
            stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
            startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
            // HTTP / SQLite config
            url: 'http://web.aioboportal.com/api/entity/share-location',
            batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
            autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
            headers: {              // <-- Optional HTTP headers
                "AIOBO-TOKEN": this.props.authToken
            },
            params: {               // <-- Optional HTTP params
                "auth_token": "maybe_your_server_authenticates_via_token_YES?"
            }
        }, (state) => {
            console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

            if (!state.enabled) {
                ////
                // 3. Start tracking!
                //
                BackgroundGeolocation.start(function () {
                    console.log("- Start success");
                });
            }
        });
    }

    onLocation(location) {
        console.log('[location] -', location);
        this.uploadCurrentLocation(location.coords);
    }

    onError(error) {
        console.warn('[location] ERROR -', error);
    }

    onActivityChange(event) {
        console.log('[activitychange] -', event);  // eg: 'on_foot', 'still', 'in_vehicle'
    }

    onProviderChange(provider) {
        console.log('[providerchange] -', provider.enabled, provider.status);
    }

    onMotionChange(event) {
        console.log('[motionchange] -', event.isMoving, event.location);
    }

    handleFirstConnectivityChange(reach) {
        console.log('First change: ' + reach);
        this.props.changeNetworkStatus(reach != 'NONE');
    }

    componentWillUnmount() {
        NetInfo.removeEventListener(
            'change',
            this.handleFirstConnectivityChange.bind(this)
        );
        if (this.interval) {
            clearInterval(this.interval);
        }
        BackgroundGeolocation.removeListeners();
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!');
            if (this.props.authToken != '') {
                this.props.getLoginStatus();
            }
        }

        this.setState({appState: nextAppState});
    };

    uploadCurrentLocation(location) {
        console.log('upload-location');
        this.props.uploadLocation(location.latitude, location.longitude);
    }

    render() {
        if (this.props.isLoggedIn) {
            axios.defaults.headers.common['AIOBO-TOKEN'] = this.props.authToken;
            return <Home/>;
        } else {
            return <Login/>;
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        authToken: state.auth.authToken,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        changeNetworkStatus: (status) => {
            dispatch(networkStatus(status));
        },
        uploadLocation: (lat, lng) => {
            dispatch(postRequest(Config.EVENT_SHARE_LOCATION_URL, {
                lat: lat,
                lng: lng
            }, 'share_location'));
        },
        logout: () => {
            dispatch(logout());
        },
        getLoginStatus: () => {
            dispatch(getRequest(Config.GET_AGENT_STATUS_URL, 'login_status'))
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(App);