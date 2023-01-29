import * as $ from 'jquery';

import {Page} from "./page";
import * as chartjs from 'chart.js';

export class DetailsPage extends Page {

    override init(): void {
        super.init();

        let elem: JQuery<HTMLElement> =$('#activity-chart');
        if (elem === null) {
            return;
        }
        console.log('init activity chart');

        const canvas = elem.get(0) as HTMLCanvasElement;

        let data = elem.data('chart');
        //[{"date":"164444444", "count": 0}, ]
        let labels = [];
        let values = [];
        for (let i = 0; i < data.length; i++) {
            labels.push(data[i].date);
            values.push(data[i].count);
        }

        new chartjs.Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: '#886EB4',
                    borderColor: '#624f82',
                    data: values
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                elements: {
                    line: {
                        borderWidth: 3
                    },
                    point: {
                        radius: 0
                    }
                },
                tooltips: {
                    enabled: false
                },
                scales: {
                    min: "0",
                    max: "100",
                    yAxes: [
                        {
                            display: false
                        }
                    ],
                    xAxes: [
                        {
                            display: false,
                            type: 'time',
                        }
                    ]
                }
            }
        });
    }
}