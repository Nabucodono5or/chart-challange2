import { select } from "d3-selection";
import { csv } from "d3-fetch";

csv(require("../data/netflix_titles.csv")).then((data) => {
  console.log(data);
});
