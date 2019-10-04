
(function() {
    // Create the connector object
    // Define the schema
    var dataTable = null;
    var map = null;
    var cols = [];
    var myUrl = "http://localhost/tableau-api";
    
    $.ajax({
        url: myUrl,
        dataType: 'json',
        async: false,
        success: function(result) {
            dataTable = result
            map = dataTable[0]   
            cols = getCols(map)
        }
    });
    
    var myConnector = tableau.makeConnector();    
    myConnector.getSchema = function(schemaCallback) {
        console.log(cols)
        var tableSchema = {
            id: "result",
            alias: "Result",
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
            for (key in cols) {
                number = i.toString()
                data[cols[key]["id"]] = eval("dataTable["+ number +"]." + cols[key]["id"])
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
            tableau.connectionName = "Result API"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();

function getType(value){
    result = null
    if(typeof(value)  != 'undefined' && value != null){
        if(isNaN(value)){
            result = typeof(value)
        }else{
            if(Number(value) === value && value % 1 !== 0){
                result = "float"
            }else{
                result = "int"
            }
        }
    }else{
        result = "string"
    }
    return result
}

function getCols(map){
    cols = []
    for (key in map) {
        tipe = getType(map[key])
        console.log(map[key])
        column_dict = {
            id : key,
            alias : key.toString().toUpperCase().replace("_", " "),
            dataType: window["tableau"]["dataTypeEnum"][tipe]
        }
        
        cols.push(column_dict);
    }
    return cols
}
