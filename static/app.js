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
        var trace3 = {
            domain: {x: [0, 1], y: [0, 1]},
            title: {text: "Scrubs per Week"},
            value: metadata.wfreq,
            type: "indicator",
            mode: "gauge+number"
        }

        var gaugeChartData = [trace3]

        var layoutGauge = {
            width: 500,
            height: 400,
            margin: {
                t: 0,
                b: 0
            }
        }

        Plotly.newPlot("gauge", gaugeChartData, layoutGauge)
    })
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