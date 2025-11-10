// Intentionally unoptimized JavaScript with many improvement opportunities

// Import entire libraries instead of specific functions (poor tree-shaking)
import * as _ from 'lodash';
import moment from 'moment';
import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Chart from 'chart.js/auto';

// Import local styles
import './styles.css';

// Import unused modules
import './unused-module.js';

console.log('App starting...');

// Use only small portions of large libraries
const numbers = [1, 2, 3, 4, 5];
const doubled = _.map(numbers, n => n * 2);
console.log('Doubled numbers:', doubled);

// Use moment.js for simple date operations (could use native Date)
const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
document.getElementById('current-time').textContent = currentTime;

// jQuery for simple DOM manipulation (could use vanilla JS)
$(document).ready(function() {
    console.log('jQuery ready');
    
    $('#test-btn').on('click', function() {
        // Simulate async operation
        axios.get('https://jsonplaceholder.typicode.com/posts/1')
            .then(response => {
                const result = `
                    <h4>API Response:</h4>
                    <p><strong>Title:</strong> ${response.data.title}</p>
                    <p><strong>Body:</strong> ${response.data.body}</p>
                `;
                $('#result').html(result);
            })
            .catch(error => {
                $('#result').html('<p style="color: red;">Error loading data</p>');
                console.error('Error:', error);
            });
    });
});

// Chart.js usage (entire library loaded for simple chart)
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Unused functions that should be removed
function unusedFunction1() {
    console.log('This function is never called');
    return _.shuffle([1, 2, 3, 4, 5]);
}

function unusedFunction2() {
    const date = moment().subtract(1, 'year');
    return date.format('YYYY-MM-DD');
}

// More unnecessary code
const largeUnusedArray = new Array(1000).fill(0).map((_, i) => ({
    id: i,
    name: `Item ${i}`,
    data: _.random(0, 100)
}));

// Inefficient operations
setTimeout(() => {
    console.log('Delayed log message');
    // Could be optimized
    for (let i = 0; i < 1000; i++) {
        // Wasteful loop
    }
}, 1000);