var options = {
    chart: {
        type: 'line',
        height: 350,
        width: 650
    },
    series: [{
        name: 'Fucks I gave',
        type: 'column',
        data: [10,24,56,97,149,72,40,27,12]
    },
    {
        name: 'Verkaufszahlen',
        type: 'line',
        data: [30,40,45,50,49,60,70,91,125]
    }
    ],
    stroke: {
        width: [0,4]
    },
    labels: ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    title: {
        text: 'Produkt x - Verkaufszahlen',
        align: 'left'
    },
    yaxis: [{
        title: {
            text: 'Gesamtumsatz'
        }
    },{
        opposite: true,
        title: {
            text: 'Produkt x'
        }
    }]
}

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();