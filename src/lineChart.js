import { scaleBand, scaleLinear, max, axisBottom, axisLeft } from "d3";
import { line } from "d3-shape";

function createVariables(variable, incomingData) {
  return incomingData.map((d) => d[variable]);
}

function createXScale(variables, innerWidth) {
  return scaleBand().domain(variables).range([0, innerWidth]).paddingInner(1);
}

function createYScale(incomingData, innerHeight) {
  return scaleLinear()
    .domain([0, max(incomingData, (d) => d.total + 1000)])
    .range([innerHeight, 0]);
}

function createXAxis(xScale, innerHeight) {
  return axisBottom(xScale).tickSize(-innerHeight).tickPadding(9);
}

function createYAxis(yScale, innerWidth) {
  return axisLeft(yScale).tickSize(-innerWidth).ticks(6).tickPadding(10);
}

function createLineGenerator(xValue, yValue) {
  return line().x(xValue).y(yValue);
}


export function lineChart(svg, props) {
  const { width, height, margin, variable, incomingData } = props;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  let variables = createVariables(variable, incomingData);
  let xValue = (d) => xScale(d[variable]);
  let yValue = (d) => yScale(d.total);

  let xScale = createXScale(variables, innerWidth);
  let yScale = createYScale(incomingData, innerHeight);

  let xAxis = createXAxis(xScale, innerHeight);
  let yAxis = createYAxis(yScale, innerWidth);

  let lineGenerator = createLineGenerator(xValue, yValue);

  let gGroup = svg
    .append("g")
    .attr("class", "gGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let xAxisG = gGroup
    .append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${innerHeight})`)
    .call(xAxis);

  let yAxisG = gGroup
    .append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${0}, 0)`)
    .call(yAxis);

  xAxisG
    .selectAll("text")
    .attr("transform", `rotate(45)`)
    .attr("text-anchor", "start")
    .style("font-size", "0.6rem");

  gGroup
    .selectAll("circle")
    .data(incomingData)
    .enter()
    .append("circle")
    .attr("r", 4)
    .attr("cx", xValue)
    .attr("cy", yValue);

  gGroup
    .append("path")
    .attr("class", "line-ratings")
    .attr("d", lineGenerator(incomingData));
}
