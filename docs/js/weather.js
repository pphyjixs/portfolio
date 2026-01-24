const weatherCard = document.getElementById("weatherCard");
const weatherInner = document.getElementById("weatherInner");
const city = "Shenzhen";
const apiKey = "np5u9wdbwd.re.qweatherapi.com";
const weatherUrl = `https://${apiKey}/v7/weather/now/{${city}}?lang=zh`;


async function fetchWeather () {
    try {
        const response =await fetch (weatherUrl);
        if (!response.ok) {
            console.log ("response not ok:" ,response);
            throw new Error ("网络响应失败");
        }
        const data = await response.json ();
        console.log ("fetch weather data:",data);
    } catch (error) {
        console.error ("发生错误：",error);
    }
}

weatherCard.addEventListener("DOMContentLoaded", fetchWeather);