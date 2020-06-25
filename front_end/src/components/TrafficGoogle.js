import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose  } from 'redux';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// google map
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

// import images
import BaustelleImage from '../images/Baustelle.png';
import SperrungImage from '../images/Sperrung.png';
import UnfallImage from '../images/Unfall.png';

// import css
import './style.css';

// map size
const mapStyles = {
    width: '55%',
    height: '100%',
};

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
            statisticsData: null
        };
    }

    componentWillMount () {
        console.log('---------------', this.props.mapData.mapData);
        let oneday = 24 * 60 * 60;
        // regex for each district
        var regexList = ["Schöneberg", "Pankow", "Neukölln", "Kreuzberg", "Mitte", "Friedrichshain", "Charlottenburg", "Wilmersdorf", "Lichtenberg", "Reinickendorf", "Tempelhof", "Steglitz", "Zehlendorf", "Köpenick", "Treptow", "Marzahn", "Hellersdorf", "Spandau"];

        // basic data for each statistics
        var numberList = {
            Mitte: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Kreuzberg: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Pankow: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Charlottenburg: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Lichtenberg: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Reinickendorf: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Schöneberg: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Neukölln: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Steglitz: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Köpenick: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Marzahn: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Spandau: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            }
        };

        // search statistics data from the back-end
        this.props.mapData.mapData.map(item => {
            regexList.map(searchValue => {
                let regex = new RegExp('^' + searchValue + '|' + searchValue + '.|.' + searchValue, 'i');
                let timeStamp = ((moment(item.validities[0].timeTo) - moment(item.validities[0].timeFrom)) / oneday).toFixed();
                if (regex.test(item.street[0])) {
                    switch (searchValue) {
                    case "Friedrichshain":
                        numberList["Kreuzberg"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Kreuzberg"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Kreuzberg"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Kreuzberg"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Kreuzberg"]["8"] += 1;
                        } else {
                            numberList["Kreuzberg"]["16"] += 1;
                        }
                        break;
                    case "Wilmersdorf":
                        numberList["Charlottenburg"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Charlottenburg"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Charlottenburg"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Charlottenburg"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Charlottenburg"]["8"] += 1;
                        } else {
                            numberList["Charlottenburg"]["16"] += 1;
                        }
                        break;
                    case "Tempelhof":
                        numberList["Schöneberg"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Schöneberg"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Schöneberg"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Schöneberg"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Schöneberg"]["8"] += 1;
                        } else {
                            numberList["Schöneberg"]["16"] += 1;
                        }
                        break;
                    case "Zehlendorf":
                        numberList["Steglitz"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Steglitz"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Steglitz"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Steglitz"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Steglitz"]["8"] += 1;
                        } else {
                            numberList["Steglitz"]["16"] += 1;
                        }
                        break;
                    case "Treptow":
                        numberList["Köpenick"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Köpenick"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Köpenick"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Köpenick"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Köpenick"]["8"] += 1;
                        } else {
                            numberList["Köpenick"]["16"] += 1;
                        }
                        break;
                    case "Hellersdorf":
                        numberList["Marzahn"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Marzahn"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Marzahn"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Marzahn"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Marzahn"]["8"] += 1;
                        } else {
                            numberList["Marzahn"]["16"] += 1;
                        }
                        break;
                    default:
                        numberList[searchValue].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList[searchValue]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList[searchValue]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList[searchValue]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList[searchValue]["8"] += 1;
                        } else {
                            numberList[searchValue]["16"] += 1;
                        }
                        break;
                    }
                }
            });
        });

        this.setState({
            data: this.props.mapData.mapData,
            sourceData: this.props.mapData.mapData,
            statisticsData: numberList
        });
    }

    // show modal for detail of each point
    onMarkerClick (props, marker, e) {
        this.setState({
            activeMarker: marker,
            showingInfoWindow: true,
            selectedMarker: props.markerData
        });
    }

    // close modal of each point
    onMapClicked (props) {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    // statistics and data searching with "from time" and "to time"
    onStatistics() {
        let oneday = 24 * 60 * 60;
        // regex for each district
        var regexList = ["Schöneberg", "Pankow", "Neukölln", "Kreuzberg", "Mitte", "Friedrichshain", "Charlottenburg", "Wilmersdorf", "Lichtenberg", "Reinickendorf", "Tempelhof", "Steglitz", "Zehlendorf", "Köpenick", "Treptow", "Marzahn", "Hellersdorf", "Spandau"];

        // basic data for each statistics
        var numberList = {
            Mitte: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Kreuzberg: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Pankow: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Charlottenburg: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Lichtenberg: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Reinickendorf: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Schöneberg: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Neukölln: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Steglitz: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Köpenick: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Marzahn: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            },
            Spandau: {
                total: 0,
                "16": 0,
                "8": 0,
                "4": 0,
                "2": 0,
                "0": 0,
            }
        };

        // new searched map Data
        var newMapData = [];

        // search map data with "from time" and "to time"
        this.state.sourceData.map(item => {
            if ((moment(item.validities[0].timeFrom).toDate() >= moment(this.state.fromDate).toDate()) && (moment(item.validities[0].timeTo).toDate() <= moment(this.state.toDate).toDate())) {
                newMapData.push(item);
                regexList.map(searchValue => {
                let regex = new RegExp('^' + searchValue + '|' + searchValue + '.|.' + searchValue, 'i');
                let timeStamp = ((moment(item.validities[0].timeTo) - moment(item.validities[0].timeFrom)) / oneday).toFixed();
                if (regex.test(item.street[0])) {
                    switch (searchValue) {
                    case "Friedrichshain":
                        numberList["Kreuzberg"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Kreuzberg"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Kreuzberg"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Kreuzberg"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Kreuzberg"]["8"] += 1;
                        } else {
                            numberList["Kreuzberg"]["16"] += 1;
                        }
                        break;
                    case "Wilmersdorf":
                        numberList["Charlottenburg"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Charlottenburg"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Charlottenburg"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Charlottenburg"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Charlottenburg"]["8"] += 1;
                        } else {
                            numberList["Charlottenburg"]["16"] += 1;
                        }
                        break;
                    case "Tempelhof":
                        numberList["Schöneberg"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Schöneberg"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Schöneberg"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Schöneberg"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Schöneberg"]["8"] += 1;
                        } else {
                            numberList["Schöneberg"]["16"] += 1;
                        }
                        break;
                    case "Zehlendorf":
                        numberList["Steglitz"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Steglitz"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Steglitz"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Steglitz"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Steglitz"]["8"] += 1;
                        } else {
                            numberList["Steglitz"]["16"] += 1;
                        }
                        break;
                    case "Treptow":
                        numberList["Köpenick"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Köpenick"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Köpenick"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Köpenick"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Köpenick"]["8"] += 1;
                        } else {
                            numberList["Köpenick"]["16"] += 1;
                        }
                        break;
                    case "Hellersdorf":
                        numberList["Marzahn"].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList["Marzahn"]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList["Marzahn"]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList["Marzahn"]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList["Marzahn"]["8"] += 1;
                        } else {
                            numberList["Marzahn"]["16"] += 1;
                        }
                        break;
                    default:
                        numberList[searchValue].total += 1;
                        if (timeStamp >= 0 && timeStamp < 2) {
                            numberList[searchValue]["0"] += 1;
                        } else if (timeStamp >=2 && timeStamp < 4) {
                            numberList[searchValue]["2"] += 1;
                        } else if (timeStamp >= 4 && timeStamp < 8) {
                            numberList[searchValue]["4"] += 1;
                        } else if (timeStamp >= 8 && timeStamp < 16) {
                            numberList[searchValue]["8"] += 1;
                        } else {
                            numberList[searchValue]["16"] += 1;
                        }
                        break;
                    }
                }
            });
            }
        });

        // save map data and statistics data
        this.setState({
            data: newMapData,
            statisticsData: numberList
        });
    }

    // from time for Statistics
    handleChangeFrom = date => {
        this.setState({
            fromDate: date
        });
    };

    // to time for Statistics
    handleChangeTo = date => {
        this.setState({
            toDate: date
        });
    };

    displayStatistic = () => {
        // value list for y-scale
        let recurringList = [
            {
                title: "> 16",
                value: "16"
            },
            {
                title: "8 - 16",
                value: "8"
            },
            {
                title: "4 - 8",
                value: "4"
            },
            {
                title: "2 - 4",
                value: "2"
            },
            {
                title: "0 - 2",
                value: "0"
            },
        ];

        // return stastistic table
        return recurringList.map(list => {
            return (
                <tr>
                    <td className="y-title">{ list.title }</td>
                    <td>{ ((this.state.statisticsData["Mitte"][list.value] / this.state.statisticsData["Mitte"].total) * 100).toFixed() + "%" }</td>
                    <td>{ ((this.state.statisticsData["Kreuzberg"][list.value] / this.state.statisticsData["Kreuzberg"].total) * 100).toFixed() + "%" }</td>
                    <td>{ ((this.state.statisticsData["Pankow"][list.value] / this.state.statisticsData["Pankow"].total) * 100).toFixed() + "%" }</td>
                    <td>{ ((this.state.statisticsData["Charlottenburg"][list.value] / this.state.statisticsData["Charlottenburg"].total) * 100).toFixed() + "%" }</td>
                    <td>{ ((this.state.statisticsData["Spandau"][list.value] / this.state.statisticsData["Spandau"].total) * 100).toFixed() + "%" }</td>
                    <td>{ ((this.state.statisticsData["Steglitz"][list.value] / this.state.statisticsData["Steglitz"].total) * 100).toFixed() + "%" }</td>
                    <td>{ ((this.state.statisticsData["Schöneberg"][list.value] / this.state.statisticsData["Schöneberg"].total) * 100).toFixed() + "%" }</td>
                    <td>{ ((this.state.statisticsData["Neukölln"][list.value] / this.state.statisticsData["Neukölln"].total) * 100).toFixed() + "%" }</td>
                    <td>{ ((this.state.statisticsData["Köpenick"][list.value] / this.state.statisticsData["Köpenick"].total) * 100).toFixed() + "%" }</td>
                    <td>{ ((this.state.statisticsData["Marzahn"][list.value] / this.state.statisticsData["Marzahn"].total) * 100).toFixed() + "%" }</td>
                    <td>{ ((this.state.statisticsData["Lichtenberg"][list.value] / this.state.statisticsData["Lichtenberg"].total) * 100).toFixed() + "%" }</td>
                    <td>{ ((this.state.statisticsData["Reinickendorf"][list.value] / this.state.statisticsData["Reinickendorf"].total) * 100).toFixed() + "%" }</td>
                </tr>
            )
        });
    };

    // display Markers for each points on the map
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
                                    <img src={this.state.selectedMarker.name === "Sperrung" ? SperrungImage : (this.state.selectedMarker.name === "Baustelle" ? BaustelleImage : UnfallImage)} alt="" />
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
                        <div className="search-wrapper">
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
                        </div>
                        <div className="diagram">
                            <table>
                                <tbody>
                                    {this.displayStatistic()}
                                    <tr className="district-field">
                                        <td className="y-title" title="Districts">Districts</td>
                                        <td title="Mitte">Mitte</td>
                                        <td title="Friedrichshain-kreuzberg">Friedrichshain-kreuzberg</td>
                                        <td title="pankow">pankow</td>
                                        <td title="Charlottenburg-wilmehsdorf">Charlottenburg-wilmehsdorf</td>
                                        <td title="spandau">spandau</td>
                                        <td title="steglitz-zehlendorf">steglitz-zehlendorf</td>
                                        <td title="Tempelhof-Schöneberg">Tempelhof-Schöneberg</td>
                                        <td title="Neukölln">Neukölln</td>
                                        <td title="Treptow-köpenick">Treptow-köpenick</td>
                                        <td title="marzahn-hellersdorf">marzahn-hellersdorf</td>
                                        <td title="Lichtenberg">Lichtenberg</td>
                                        <td title="reinickendorf">reinickendorf</td>
                                    </tr>
                                 </tbody>
                            </table>
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
