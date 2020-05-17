// fills in dashboard with information and plots
function optionChanged() {
    d3.json("data/samples.json").then(function(importedData) {
        var data = importedData

        // value of the dropdown menu selected
        var subject_id = d3.select("#selDataset").node().value
        
        // identify metadata and sample data
        var metadata = data.metadata.filter(function(d) {return d.id == subject_id})[0]
        var samples = data.samples.filter(function (d) {return d.id == subject_id})
        
        // add metadata to Demographics chart
        var demoData = d3.select("#sample-metadata");

        // clear previous data before entering new data
        demoData.text("")

        Object.entries(metadata).forEach(([key, value]) => {
            demoData.append("p").text(`${key}: ${value}`);
        });

        // sort the data from most to least sample values
        samples.sort(function(a,b){
            return parseInt(b.sample_values) - parseInt(a.sample_values)
        })

        // create arrays of the information (both complete data and top data)
        var otu_ids = samples[0].otu_ids
        var top_otu_ids = otu_ids.slice(0,10).reverse()
        var otu_labels = samples[0].otu_labels
        var top_otu_labels = otu_labels.slice(0,10).reverse()
        var sample_values = samples[0].sample_values
        var top_sample_values = sample_values.slice(0,10).reverse()
        
        // convert into string with OTU in front to show properly
        var ticks = top_otu_ids.map(otu => `OTU ${otu}`);

        // formatting the bar chart
        var trace1 = {
            x: top_sample_values,
            y: ticks,
            text: top_otu_labels,
            type: "bar",
            orientation: "h"
        }

        var barChartData = [trace1]

        var layout = {
            title: `Top 10 OTUs`,
            xaxis: {title: "Sample Value"}
        }

        Plotly.newPlot("bar", barChartData, layout)
        
        // create bubble chart of ALL samples
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                colorscale: [[0, 'blue'], [1, 'red']],
                opacity: 0.75,
                size: sample_values,
                sizeref: 0.05,
                sizemode: "area"
            }
        }
        
        var bubbleChartData = [trace2]
        
        var layoutBubble = {
            title: "Sample Value for each OTU ID",
            height: 500,
            width: 900,
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Value"}
        }
        
        Plotly.newPlot('bubble', bubbleChartData, layoutBubble)
        
        // create gauge chart
        // needle
        var degrees = 9 - metadata.wfreq,
            radius = .5
        var radians = degrees * Math.PI / 9
        var x = radius * Math.cos(radians)
        var y = radius * Math.sin(radians)

        //  constructing the path where x is the xpath, and y is the ypath, and z is the end path
        var mainPath = 'M -.0 -0.025 L .0 0.025 L '
        var path = mainPath.concat(`${x}  ${y}  z`)

        var gaugeChartData = [{
            type: 'scatter',
            x: [0],
            y: [0],
            marker: {size: 20, color: 'red'},
            showlegend: false,
            name: "Scrubs/Week",
            text: metadata.wfreq
        },
        {
            textinfo: 'text',
            textposition: 'inside',
            hole: .5,
            type: 'pie',
            showlegend: false,
            marker: { colors: ['#FFF0F5','#FFD1DC','#FFC1CC','#FFC0CB','#FFB7C5','#FC8EAC','#E75480','#DE3163','#E30B5D','white']},
            values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
            rotation: 90,
            text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            direction: 'clockwise',
            hoverinfo: 'text'
        }]

        var layoutGauge = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: 'red',
                line: {
                    color: 'red'
                }
            }],
            title: 'Belly Button Washing Frequency <br> Scrubs per week',
            font: {
                weight: "bold",
                size: 15,
                color: "black"
            },
            height: 500,
            width: 500,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 150
            },
            // Scaling the axes 
            xaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] },
            yaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] }
        };

        Plotly.newPlot("gauge", gaugeChartData, layoutGauge)
    })
            // showlegend: false,
            // hole: 0.4,
            // rotation: 90,
            // values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
            // text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            // direction: 'clockwise',
            // textinfo: 'text',
            // textposition: 'inside',
            // marker: {
            //     colors: ['#FFF0F5','#FFD1DC','#FFC1CC','#FFC0CB','#FFB7C5','#FC8EAC','#E75480','#DE3163','#E30B5D','white'],
            // }
        // }

        // var gaugeChartData = [trace3]

        // var layoutGauge = {
        //     shapes: [{
        //         type: 'line',
        //         x0: 0,
        //         y0: 0,
        //         x1: x,
        //         y1: y,
        //         line: {
        //           color: 'black',
        //           width: 3
        //         }
        //       }],
        //       title: 'Chart',
        //       xaxis: {visible: false, range: [-1, 1]},
        //       yaxis: {visible: false, range: [-1, 1]}
        // }

        // Plotly.newPlot("gauge", gaugeChartData, layoutG)
}

// opening funtion
function init() {    
    var dropDownMenu = d3.select("#selDataset")

    d3.json("data/samples.json").then(function(importedData) {
        var data = importedData

        // filling in the dropdown menu
        var names = data.names

        for (var name of names) {
            dropDownMenu.append("option")
            .attr("value", name)
            .text(name)
        }
    })
    
    // calling function to generate plots
    optionChanged()
}

init()