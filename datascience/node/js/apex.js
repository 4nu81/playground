var options = {
    chart: {
        type: 'line',
        height: 512,
        width: 1200
    },
    series: [{
        name: 'Klicks',
        type: 'column',
        data: [10,24,56,97,149,72,40,27,12]
    },
    {
        name: 'Antwortzeit gemittelt',
        type: 'line',
        data: [30,40,45,50,49,60,70,91,125]
    },
    {
        name: 'Max Antwortzeit',
        type: 'line',
        data: [30,40,45,50,49,60,70,91,125]
    }
    ],
    stroke: {
        width: [0,4]
    },
    labels: ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    title: {
        text: 'Log Stats on',
        align: 'left'
    },
    yaxis: [{
        title: {
            text: 'Zugriffe'
        }
    },{
        opposite: true,
        title: {
            text: 'Durchschnitt Dauer in ms'
        }
    },{
        opposite: true,
        title: {
            text: 'Max Dauer in ms'
        }
    }]
}

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();

function build_chart(data, date) {
    sortable = []
    for (key in data) {
        sortable.push({key:Date.parse(key), date:key, duration:data[key].duration, times:data[key].times, max:data[key].max})
    }
    sortable.sort((a,b) => {
        return a.key - b.key
    })
    options.labels = []
    options.series[0].data = []
    options.series[1].data = []
    options.series[2].data = []
    for (item of sortable) {
        options.labels.push(item.date)
        options.series[0].data.push(item.times)
        options.series[1].data.push(item.duration)
        options.series[2].data.push(item.max)
    }
    options.title.text = `Log Stats of ${date}`
    document.querySelector("#chart").innerHTML = ""
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
    document.getElementById("loader").style.display = "none";
    document.getElementById("chart").style.display = "block";
}

function ajax_get(date, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        try{
            var data = JSON.parse(req.responseText);
        } catch(err) {
            console.log(`${err.message} in ${req.responseText}`);
            return;
        }
        callback(data, date);
    }
    req.open("GET", `/get?date=${date}`, true);
    req.send();
}

function buttonclick() {
    date = document.querySelector("#date").value
    ajax_get(date, build_chart);
    document.getElementById("loader").style.display = "block";
    document.getElementById("chart").style.display = "none";
}