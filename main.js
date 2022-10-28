const tooltip = document.getElementById('tooltip');
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then(response =>{
    const dataSet = response.data;
    dataMover(dataSet);

  });

function dataMover(dataSet){
const padding = 40;
  const w = 1000; //scales the width in accordance to the numbers in the set
  const h = 600;
  const barWidth = 2;
  const maxY = d3.max(dataSet, function(d){
    return d[1]
  });
  const minY = d3.min(dataSet, function(d){
    return d[1]
  });

  function dateToNumber(){
    let dateArray = [];
    let slicedArray = [];
    let result = [];

    dataSet.forEach(function(d){
      dateArray.push(d[0])
    });
    for (let i=0; i<dateArray.length; i++){
      slicedArray.push(dateArray[i].split('-').slice(0,2));
    }
    for (let i=0; i<slicedArray.length; i++){
      if(slicedArray[i][1] == '01'){
        result.push(parseInt(slicedArray[i][0]));
      }
      else if(slicedArray[i][1] == '04'){
        result.push(parseInt(slicedArray[i][0])+0.25);
      }
      else if(slicedArray[i][1] == '07'){
        result.push(parseInt(slicedArray[i][0]) +0.5);
      }
      else if(slicedArray[i][1] == '10'){
        result.push(parseInt(slicedArray[i][0])+0.75);
      }
    }
return result
  };

  const maxX = d3.max(dateToNumber());
  const minX = d3.min(dateToNumber());
//console.log(dateToNumber());
  const yScale = d3.scaleLinear()
    .domain([0, maxY])
    .range([h-padding, 0]); // is inverted due to direction of bar chart

const xScale = d3.scaleLinear()
    .domain([minX, maxX])
    .range([padding, w-padding]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

const svg = d3.select('#container')
                .append('svg')
                .attr('width', w)
                .attr('height', h);

        svg.selectAll('rect')
                .data(dataSet)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('data-date', function(d){return d[0]})
                .attr('data-gdp', function(d){return d[1]})
                .attr('x', function(d,i){
                  if(d[0].split('-')[1] == '01'){
                    return xScale(parseFloat(d[0]))
                  }
                  else if(d[0].split('-')[1] == '04'){
                    return xScale(parseFloat(d[0])+0.25)
                  }
                  else if(d[0].split('-')[1] == '07'){
                    return xScale(parseFloat(d[0])+0.5)
                  }
                  else return xScale(parseFloat(d[0])+0.75)
                })
                .attr('y', function(d,i){
                  return (yScale(d[1])) // looks good
                })
                .attr('height', function(d,i){
                  return (h-padding-yScale(d[1])+"px")
                })
                .attr('width', barWidth)
                .on('mouseover', function(d,i){
                  tooltip.classList.add('show')
                  tooltip.innerHTML = 'Date: ' + i[0].slice(0,7) + '<br />' + 'GDP: $'+ i[1] +' Billion';
                  tooltip.setAttribute('data-date', i[0])
                })
                .on('mouseout', () =>{
                  tooltip.classList.remove('show')
                });

            svg.selectAll('rect')
                .append('title')
                .text(function(d){
                  return 'date:'+ d[0] +', '+ 'gdp:'+d[1]
                });

svg.append('g')
      .attr('id', 'x-axis')
      .attr("transform", "translate(0, " + (h - padding) + ")")
      .call(xAxis);
  svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate('+(padding)+',0)')
      .call(yAxis);

console.log(xScale(minX),xScale(maxX), minX, maxX, yScale(minY));

}
