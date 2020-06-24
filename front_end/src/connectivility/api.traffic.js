import axios from 'axios';

export async function getAllData(userdata) {
    const baseUrl = "http://localhost:4000/map/allData/";
    return axios.request({
        method: 'get',
        url: baseUrl
    });
}