import { select, selectAll } from "d3-selection";
import { csv } from "d3-fetch";
import iconSvg from "../resources/error.svg";

// selectAll(".icon-container").append("svg").attr("width", 50).attr("height", 60);
let width = 240;
let height = 230;

selectAll(".chart-block")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

csv(require("../data/netflix_titles.csv")).then((data) => {
  console.log(data);
});
