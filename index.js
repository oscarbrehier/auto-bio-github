import 'dotenv/config';
import axios from 'axios';
import moment from "moment";

const URLS = {
    github: 'https://api.github.com/user',
    wakatime: 'https://wakatime.com/api/v1//users/current/summaries'
};

async function init() {

    let birthDate = "2005/05/10";
    let res;

    try {

        res = await axios({
            method: 'GET',
            url: URLS.wakatime,
            params: {
                api_key: process.env['WAKATIME_KEY'],
                scope: "read_logged_time",
                start: new Date(Date.now()),
                end: new Date(Date.now())
            },
        });

    } catch (e) {

        console.log(e);

    }

    let date = new Date();
    let birthday = new Date(birthDate);
    let age = date.getFullYear() - birthday.getFullYear();

    const codeTime = res.data.data[0].grand_total.text;
    const today = moment(Date.now()).format('MMMM Do YYYY');
    const message = `A young ${age} year-old programmer - Coded Today (${today}): ${codeTime}`;

    console.log(message);

    try {

        await axios({
            method: 'patch',
            url: URLS.github,
            headers: {
                "Authorization": `token ${process.env['GITHUB_KEY']}`,
                "Content-Type": "application/vnd.github.v3+json"
            },
            data: {
                bio: message
            },
        }).then(res => {
            console.log(`updated`);
            return res;
        })

    } catch (e) {

        console.log(e);

    }

}

init();
setInterval(init, 60 * 1000 * 15);
