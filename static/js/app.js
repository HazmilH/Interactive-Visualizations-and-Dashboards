var dropDownMenu = d3.select("#selDataset")



function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index]
    })
}

function getData() {
    d3.json("../data/samples.json").then(function(data) {
        console.log(data)
        var names = data.names

        var samples = data.samples

        var metadata = data.metadata

        init(samples, metadata)
        buildDropDown(names)
    })
}

function buildDropDown(names) {
    for (var name of names) {
        dropDownMenu.append("option")
        .attr("value", name)
        .text(name)
    }
}

// default webpage
function init(samples, metadata) {
    // very first entry point
    var id_940 = samples[0]

    // add metadata to Demographics chart
    var demoData = d3.select("#sample-metadata").append("tbody")
    Object.entries(metadata[0]).map(([key, value]) =>{
        demoData.append("tr").text(`${key}: ${value}`)
    })
    
    // combine the separate arrays into an object of arrays
    var newArr = []
    
    for (i = 0; i < id_940.otu_ids.length; i++) {
        var entry = {
            "otu_ids": id_940.otu_ids[i],
            "otu_labels": id_940.otu_labels[i],
            "sample_values": id_940.sample_values[i]
        }
        newArr.push(entry)
    }

    // find the the top 10 to create a horizontal bar chart
    newArr.sort(function(a,b){
        return parseInt(b.sample_values) - parseInt(a.sample_values)
    })

    top10 = newArr.slice(0,10)

    top10 = top10.reverse()

    var trace1 = {
        x: top10.map(row => row.sample_values),
        y: top10.map(row => `OTU ${row.otu_ids}`),
        text: top10.map(row => row.otu_labels),
        type: "bar",
        orientation: "h"
    }

    var barChartData = [trace1]

    var layout = {
        title: `Top 10 OTUs found in Subject ${metadata[0].id}`
    }

    Plotly.newPlot("bar", barChartData, layout)

    console.log(top10.map(row => row.otu_ids))

}

getData()