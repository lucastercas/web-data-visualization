const d3 = require('d3');

const dataSet = require('./global-temperature.json');
const data = dataSet.monthlyVariance;

const width = 1000;
const height = 600;
const padBot = 25;
const padLeft = 25;

console.log(data);

d3.select('main')
  .append('h2')
  .text(
    `${d3.min(data, d => d.year)} - ${d3.max(
      data,
      d => d.year
    )}: base temperature ${dataSet.baseTemperature} C`
  );

const xScale = d3
  .scaleLinear()
  .domain([d3.min(data, d => d.year), d3.max(data, d => d.year)])
  .range([padLeft, width - 15]);

const yScale = d3
  .scaleLinear()
  .domain([0, 13])
  .range([height - padBot, -5]);

const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden');

const chart = d3
  .select('#chart')
  .attr('width', width)
  .attr('height', height);

chart
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', (d, i) => {
    //console.log(`X: ${xScale(d.year)}`);
    return xScale(d.year);
  })
  .attr('y', (d, i) => {
    //console.log(`Y: ${d.month}`);
    return yScale(d.month) - 22;
  })
  .attr('width', (d, i) => 2)
  .attr('height', (d, i) => 44)
  .attr('class', 'bar')
  .attr('fill', d => {
    const temp = dataSet.baseTemperature - d.variance;
    const colors = {
      '1': '#458588',
      '2': '#83a598',
      '3': '#689d6a',
      '4': '#8ec07c',
      '5': '#d3869b',
      '6': '#ebdbb2',
      '7': '#d79921',
      '8': '#d65d0e',
      '9': '#fe8019',
      '10': '#fb4934',
      '11': '#cc241d',
    };
    if (temp <= 2.8) {
      return colors['1'];
    } else if (temp <= 3.9) {
      return colors['2'];
    } else if (temp <= 5) {
      return colors['3'];
    } else if (temp <= 6.1) {
      return colors['4'];
    } else if (temp <= 7.2) {
      return colors['5'];
    } else if (temp <= 8.3) {
      return colors['6'];
    } else if (temp <= 9.5) {
      return colors['7'];
    } else if (temp <= 10.6) {
      return colors['8'];
    } else if (temp <= 11.7) {
      return colors['9'];
    } else if (temp <= 12.8) {
      return colors['10'];
    } else {
      return colors['11'];
    }
  })
  .on('mouseover', d =>
    tooltip
      .style('visibility', 'visible')
      .html(
        `${d.year} - ${d.month}<br>${dataSet.baseTemperature -
          d.variance}<br/>${d.variance}`
      )
  )
  .on('mousemove', () =>
    tooltip
      .style('top', event.pageY - 10 + 'px')
      .style('left', event.pageX + 10 + 'px')
  )
  .on('mouseout', () => tooltip.style('visibility', 'hidden'));

/* Bottom Axis */
const botLabel = d3.axisBottom(xScale);
chart
  .append('g')
  .attr('transform', `translate(0, ${height - padBot})`)
  .call(botLabel);

/* Left Axis */
const leftLabel = d3.axisLeft(yScale);
chart
  .append('g')
  .attr('transform', `translate(${padLeft}, ${0})`)
  .call(leftLabel);
