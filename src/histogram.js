import { histogram, extent } from "d3-array";
import { scaleLinear, max, axisBottom, axisLeft } from "d3";

function createXScale(incomingData, innerWidth) {
  return scaleLinear()
    .domain(extent(incomingData, (d) => d.release_year))
    .range([0, innerWidth]);
}

function createYScale(maxBin, innerHeight) {
  return scaleLinear()
    .domain([maxBin + 500, 2000, 500, 0])
    .range([0, 50, 100, innerHeight]);
}

function createHistogramLayout() {
  return histogram().value((d) => {
    return d.release_year;
  });
}

function createXAxis(xScale, innerHeight) {
  return axisBottom(xScale).ticks(5).tickSize(-innerHeight).tickPadding(9);
}

function createYAxis(yScale, maxBin) {
  return axisLeft(yScale).tickValues([maxBin, 2000, 1000, 300, 0]);
}

export function histoChart(svg, props) {
  const { width, height, margin, incomingData } = props;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  let xValue = (d) => xScale(d.release_year);
  let xPosition = (d) => xScale(d.x0);
  let yValue = (d) => yScale(d.length);

  let xScale = createXScale(incomingData, innerWidth);

  let h = createHistogramLayout();

  let bins = h(incomingData);
  let maxBin = max(bins, (d) => d.length);

  let yScale = createYScale(maxBin, innerHeight);

  let xAxis = createXAxis(xScale, innerHeight);
  let yAxis = createYAxis(yScale, maxBin);

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

  gGroup
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "bar-graph")
    .attr("x", xPosition)
    .attr("y", yValue)
    .attr("width", 10)
    .attr("height", (d) => innerHeight - yScale(d.length));
}
