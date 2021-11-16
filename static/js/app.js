// BuildMetadata
function createMetadata(sample) {
    // Read sample.json with d3
    d3.json("samples.json").then((data) => {
        // Get metadata from data
        var metadata = data.metadata;

        // filter id so when selected id will show its properties a.k.a metadata
        var sampleArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = sampleArray[0]
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");

        // Populate panel with values from the key selected (i.e key = 940)
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key}: ${value}`);
        });
    })
}

// Function to create Bar chart and Bubble Chart
function createPlots(sample) {
    // Use d3.json to read samples data for the plots
    d3.json("samples.json").then((data) => {
        var samples = data.samples;

        // Filter by id selected to get samples values
        var sampleArray = samples.filter(sampleObject => sampleObject.id == sample);
        var result = sampleArray[0]

        var values = result.sample_values; // Values for chart
        var hovertext_label = result.otu_labels; // Labels for hovertext 
        var labels = result.otu_ids; // Labels for chart
        
        console.log(values)
        console.log(labels)

        // Create bar_data, Use slice to get top 10 OTUs for each sample
        var bar_data = [
            {
                x: values.slice(0,10).reverse(),
                y: labels.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
                hovertext: hovertext_label.slice(0,10).reverse(),
                hoverinfo: "hovertext",
                type: "bar",
                orientation: "h"
            }
        ];
        console.log(bar_data)
        // Create bar_layout
        var bar_layout = {
            title: "Top 10 OTUs",
            margin: {t:30, l:120}
        };
        console.log(bar_layout)
        // Create Plot at div with id "bar"
        Plotly.newPlot("bar", bar_data, bar_layout);
    

    //  Create data for bubble
    var bubble_data = [
        {
            x:labels,
            y: values,
            text: hovertext_label,
            mode: "markers",
            marker: {
                color: labels,
                size: values
            }
        }
    ];

    // Create layout for bubble
    var bublle_layout = {
        margin: {t: 0},
        xaxis: {title: "OTU ID"},
        hobermode: "closest"
    };

    Plotly.newPlot("bubble", bubble_data, bublle_layout);
    });
}

// Init function
function init() {
    // Dropdown select element for the dataset
    var select = d3.select("#selDataset");

    // Use sample names to populate the select options
    d3.json("samples.json").then((data) => {
        var names = data.names;
        names.forEach((sample) => {
            select
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        // Set first sample for initial plot
        const firstSample = names[0];
        createMetadata(firstSample);
        createPlots(firstSample);
    });
}

// Option Change function to change sample selected and update webpage
function optionChanged(newSample) {
    // Get new data each time a new sample is selected from the dropdown buttom
    createMetadata(newSample);
    createPlots(newSample);
}


//  Initialize dashboard
init();