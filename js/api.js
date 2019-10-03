
(function() {
    // Create the connector object
    // Define the schema
    var dataTable = null;
    var map = null;
    var cols = [];
    var myUrl = "http://dummy.restapiexample.com/api/v1/employees";
    
    $.ajax({
        url: myUrl,
        dataType: 'json',
        async: false,
        success: function(result) {
            dataTable = result
            console.log(dataTable)
            map = dataTable[0]   
            for (const [key, value] of Object.entries(map)) {
                column_dict = {
                    id : key,
                    alias : key.toString().toUpperCase().replace("_", " "),
                    dataType: window["tableau"]["dataTypeEnum"][typeof(value)]
                }
                cols.push(column_dict);
            }
        }
    });

    var myConnector = tableau.makeConnector();    
    myConnector.getSchema = function(schemaCallback) {
        var tableSchema = {
            id: "customer",
            alias: "Customer",
            columns: cols
        };
        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        var tableData = [];
        // Iterate over the JSON object
        for (var i = 0, len = dataTable.length; i < len; i++) {
            data = {}
            for (const [key, value] of Object.entries(cols)){
                number = i.toString()
                data[value["id"]] = eval("dataTable["+ number +"]." + value["id"])
            }   
            tableData.push(data);
        }
        table.appendRows(tableData);
        doneCallback();
    };
   
    
    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Customer"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();



