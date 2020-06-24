import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose  } from 'redux';
import moment from 'moment';
import DatePicker from "react-datepicker";
import BarChart from 'react-bar-chart';
 
import "react-datepicker/dist/react-datepicker.css";

// google map
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

// import images
import BaustelleImage from '../images/Baustelle.png';
import SperrungImage from '../images/Sperrung.png';
import UnfallImage from '../images/Unfall.png';

// import css
import './style.css';

const mapStyles = {
    width: '70%',
    height: '100%',
};

const margin = {top: 40, right: 20, bottom: 30, left: 60};

class TrafficGoogle extends Component {
    constructor(props) {
        super(props);

        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
        this.handleChangeFrom = this.handleChangeFrom.bind(this);
        this.handleChangeTo = this.handleChangeTo.bind(this);
        this.onStatistics = this.onStatistics.bind(this);

        this.state = {
            data: null,
            sourceData: null,
            center: { lat: 52.5200, lng: 13.4050 }, // berlin latitude and longitude
            showingInfoWindow: false,
            activeMarker: null,
            selectedMarker: null,
            fromDate: new Date(),
            toDate: new Date(),
            width: 350,
            statisticsData: [
                { text: 'Total-Statistics', value: 1000 },
                { text: 'Searched-Statistics', value: 0 }
            ]
        };
    }

    componentWillMount () {
        this.setState({
            data: this.props.mapData.mapData,
            sourceData: this.props.mapData.mapData
        });
    }

    onMarkerClick (props, marker, e) {
        this.setState({
            activeMarker: marker,
            showingInfoWindow: true,
            selectedMarker: props.markerData
        });
    }

    onMapClicked (props) {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    onStatistics() {
        // filter by period
        var statistics_count = 0;
        var newMapData = [];
        this.state.sourceData.map(item => {
            if ((moment(item.validities[0].timeFrom).toDate() >= moment(this.state.fromDate).toDate()) && (moment(item.validities[0].timeTo).toDate() <= moment(this.state.toDate).toDate())) {
                statistics_count += 1;
                newMapData.push(item);
            }
        });

        this.setState({
            data: newMapData
        });

        this.setState(prevState => {
            let statisticsData = Object.assign({}, prevState.statisticsData);
            statisticsData[1].value = statistics_count;
            return [ statisticsData ];
        });
    }

    handleChangeFrom = date => {
        this.setState({
            fromDate: date
        });
    };

    handleChangeTo = date => {
        this.setState({
            toDate: date
        });
    };

    displayMarkers = () => {
        if (this.state.data !== null) {
            return this.state.data.map((store, index) => {
                if (store.location) {
                    let icon = {
                        scaledSize: { width: 25, height: 25 }
                    };
                    switch (store.name) {
                        case "Sperrung":
                            icon['url'] = SperrungImage;
                            break;
                        case "Baustelle":
                            icon['url'] = BaustelleImage;
                            break;
                        case "Unfall":
                            icon['url'] = UnfallImage;
                            break;
                        case "Stau":
                            icon['url'] = UnfallImage;
                            break;
                        case "Gefahr":
                            icon['url'] = UnfallImage;
                            break;
                        default:
                            break;
                    }
                    
                    return  <Marker
                                key={index}
                                id={index}
                                position={{
                                    lat: store.location.coordinates[1],
                                    lng: store.location.coordinates[0]
                                }}
                                title={store.name}
                                icon={icon}
                                onClick={this.onMarkerClick}
                                markerData={store}
                            />
                }
            })
        }
    }

    render () {
        return (
            <div>
                <Map
                    google={this.props.google}
                    zoom={15}
                    style={mapStyles}
                    initialCenter={this.state.center}
                    onClick={this.onMapClicked}
                >
                    {this.displayMarkers()}
                    <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}
                    >
                        {
                            (this.state.selectedMarker) ?
                            <div className="active-marker">
                                <div>
                                    <img src={this.state.selectedMarker.name === "Sperrung" ? SperrungImage : (this.state.selectedMarker.name === "Baustelle" ? BaustelleImage : UnfallImage)} />
                                    <label>{this.state.selectedMarker.name}</label>
                                </div>
                                <p>{this.state.selectedMarker.description}</p>
                              
                                <div>
                                    <label>Section</label>&nbsp;&nbsp;
                                    <span>{this.state.selectedMarker.section}</span>
                                </div><br></br>

                                <div>
                                    <label>Total period</label>&nbsp;&nbsp;
                                    <span>{moment(this.state.selectedMarker.validities[0].timeFrom).format("DD MM YYYY hh:mm")}&nbsp;-&nbsp;{moment(this.state.selectedMarker.validities[0].timeTo).format("DD MM YYYY hh:mm")}</span>
                                </div>
                            </div>
                            :
                            <div className="hidden"></div>
                        }
                    </InfoWindow>
                </Map>

                <div className="statistics">
                    <div className="statistics-body">
                        <h1>Select the Period</h1>
                        <div>
                            <div className="date-picker-area">
                                <h4>From Date</h4>
                                <DatePicker
                                    selected={this.state.fromDate}
                                    onChange={this.handleChangeFrom}
                                />
                            </div>
                            <br></br>
                            <div className="date-picker-area">
                                <h4>To Date</h4>
                                <DatePicker
                                    selected={this.state.toDate}
                                    onChange={this.handleChangeTo}
                                />
                            </div>
                        </div>

                        <input
                            type="button"
                            className="sta-btn"
                            onClick={this.onStatistics}
                            value="Statistics Period"
                        />
                        <div style={{ color: 'red' }}>
                            <BarChart
                                width={this.state.width}
                                height={400}
                                margin={margin}
                                color="red"
                                data={this.state.statisticsData}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
  mapData: state.traffic
});

const enhance = compose(
    connect(mapStateToProps, null),
    GoogleApiWrapper({apiKey: 'AIzaSyDoi0kDoetjxsvsctCrRb99I5lu1GJMj_8'}),
);

export default enhance(TrafficGoogle);
