var tdata = [];
var hdata = [];
var TICKINTERVAL = 3000;
var SHOWNVALUES = 10;
var XAXISRANGE = TICKINTERVAL * SHOWNVALUES;

function newSeries () {
    var date = Date.now();
    var tvalue = Math.floor(Math.random() * 100);
    var hvalue = Math.floor(Math.random() * 100);

    tdata.push(
        {
            x: date,
            y: tvalue
        }
    );
    hdata.push(
        {
            x: date,
            y: hvalue,
        }
    )
}

newSeries();

var options = {
    chart: {
        type: 'line',
        height: 350,
        width: 650,
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000,
            },
        }
    },
    series: [
        {
            name: 'Temperature',
            type: 'line',
            data: tdata,
        },
        {
            name: 'Humidity',
            type: 'line',
            data: hdata,
        }
    ],
    stroke: {
        curve: "smooth",
    },
    markers: {
        size: 0,
    },
    legend: {
        show: false
    },
    dataLabels: {
        enabled: false
    },
    title: {
        text: 'Weather Data',
        align: 'left'
    },
    xaxis: {
        type: "datetime",
        labels: {
            formatter: function (val) {
                return moment(new Date(val)).format('h:mm:ss')
            }
        },
        range: XAXISRANGE,
    },
    yaxis: [
        {
            title: {
                text: 'Temp',
            },
            labels: {
                formatter:  function (val) {
                    return val + '°C';
                }
            }
        },
        {
            opposite: true,
            title: {
                text: 'Humidity',
            },
            labels:{
                formatter: function (val) {
                    return val + '%';
                }
            }                
        }
    ],
    theme: {
        mode: 'dark'
    }
}

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();

window.setInterval(function () {
    newSeries();
    chart.updateSeries([{
        data: tdata
    },{
        data: hdata
    }]);
},TICKINTERVAL);