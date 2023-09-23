// Use D3 to load the data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    // Populate the dropdown with sample IDs
    var dropdown = d3.select("#selDataset");
    data.names.forEach(function(sample) {
        dropdown.append("option").text(sample).property("value", sample);
    });

    // Create a function to update the charts and sample metadata based on the selected sample
    function updateCharts(selectedSample) {
        // Filter data for the selected sample
        var sampleData = data.samples.find(sample => sample.id === selectedSample);

        // Create the bar chart
        var barData = [{
            x: sampleData.sample_values.slice(0, 10).reverse(),
            y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: sampleData.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        var barLayout = {
            title: `Top 10 OTUs for Sample ${selectedSample}`
        };

        Plotly.newPlot("bar", barData, barLayout);
    }

    // Call the updateCharts function to create the initial chart
    updateCharts(data.names[0]);

    // Add an event listener to the dropdown to update the charts when a new sample is selected
    dropdown.on("change", function() {
        var selectedSample = dropdown.property("value");
        updateCharts(selectedSample);
        // Also update the bubble chart and metadata here if needed
        createBubbleChart(data.samples.find(sample => sample.id === selectedSample));
        displaySampleMetadata(selectedSample);
    });

    // Create the bubble chart
    function createBubbleChart(sampleData) {
        var bubbleData = [{
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Earth"
            }
        }];

        var bubbleLayout = {
            title: `OTU Bubble Chart for Sample ${sampleData.id}`,
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Value" }
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    }

    // Create a function to display the sample metadata
    function displaySampleMetadata(selectedSample) {
        var metadata = data.metadata.find(sample => sample.id == selectedSample);
        var metadataPanel = d3.select("#sample-metadata");

        // Clear the existing metadata
        metadataPanel.html("");

        // Append each key-value pair from the metadata JSON object
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    }

    // Call the displaySampleMetadata function to display the initial metadata
    displaySampleMetadata(data.names[0]);
});
