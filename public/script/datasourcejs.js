
String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

function dataSource () {
    this.tables = [];
    this.tables.add = function(objTable){
        this.push(objTable);
    }

    this.tables.getTable = function ( tableName ) {
        return this.filter( function ( e ) { 
            return e.tableName == tableName
        })[0];
    }

    this.tables.getTableIndex = function (tableName) {
        var ret = undefined;
        
        for (var i = 0; i <= this.length-1; i++) {
            
            if (this[i].tableName == tableName) {
                return i;
            }
        }

        return ret;
    }

    this.tables.remove = function ( tableName ) {

        if ( typeof ( tableName == 'string' ) ) {
            var tbl = this.getTable( tableName );
            var indx = this.indexOf(tbl)
            this.splice(indx, 1);
        }
        else if ( typeof ( tableName == 'object' ) ) {
            this.splice( tableName, 1 );
        }
    }

    this.__render = function () {
        var dum = $("<dum>");
        var datasource = $("<datasource>");
        var tables = $("<dsTables>");

        for (var i = 0; i <= this.tables.length - 1; i++) {
            tables.append(this.tables[i].__render());
        }

        if (tables.find('row').length > 0) {
            datasource.append(tables);
            dum.append(datasource);
        }

        return dum.html();
    }
}    
function dsTable () {
    this.tableName = '';
    this.rows = [];
    
    this.rows.add = function (row) {
        this.push(row);
    }

    this.rows.getRow = function ( fieldname ) {
        return this.filter( function ( r ) { 
            return r.fieldName == fieldname;
        })[0];
    }

    this.rows.getRowIndex = function (fieldName) {
        var ret = undefined;
        
        for (var i = 0; i <= this.length-1; i++) {
            
            if (this[i].fieldName == fieldName) {
                return i;
            }
        }

        return ret;
    }

    this.rows.remove = function (row) {
        
        if ( isNaN( row ) ) {
            this.splice( this.indexOf( row ), 1 );
        }
        else {
            this.splice( row,1 );
        }
    }

    this.__render = function () {
        var dum = $("<dum>");
        var t = $("<dsTable tableName='{tablename}'>".supplant({ tablename: this.tableName }));
        var r = $("<rows>");

        for (var i = 0; i <= this.rows.length - 1; i++) {
            r.append(this.rows[i].__render());
        }

        t.append(r);
        dum.append(t);

        return dum.html().replace(/\"/g, "'");
    }
}
function dsRow (fieldname, fieldtype) {
    this.fieldName = fieldname;
    this.fieldType = fieldtype;
    this.fieldValue = '';

    switch ( fieldtype ) {
        case "int":
            this.fieldValue = 0;
            break;

        case "float":
            this.fieldValue = parseFloat( "0" );
            break;

        case "string":
            this.fieldValue = '';
            break;

        case "datetime":
            this.fieldValue = new Date();
            break;

        case "bool":
            this.fieldValue = false;
            break;
    }

    this.__render = function () {
        var props = "";
    
        for (prop in this) {
            if ((this[prop] instanceof Function) == false && typeof(this[prop]) != 'object') {
                props += (" " + prop + "=\'" + this[prop].toString().replace("'", "").replace("'", "") + "\'");
            }
        }

        return "<row {props}>".supplant({props:props});
    }
}
function parseExpression(expression) {
    
    var regex = /{([a-zA-Z(\d+)?(_)?]+)\.([a-zA-Z(\d+)?(_)?]+)}/i
    var new_expression = expression;

    while(expression.search(regex) != -1)
    {
        var index = expression.search(regex);
        var sub_exp = expression.substring(index, expression.indexOf('}') + 1);

        var tableName = sub_exp.substring(sub_exp.indexOf('{') + 1, sub_exp.indexOf('.'));
        var fieldName = sub_exp.substring(sub_exp.indexOf('.') + 1, sub_exp.indexOf('}'));
        var tableIndex = datasource.tables.getTableIndex(tableName);

        if(tableIndex != undefined)
        {
            var rowIndex = datasource.tables[tableIndex].rows.getRowIndex(fieldName);

            if(rowIndex != undefined)
            {
                var replace_string = "datasource.tables[" + tableIndex + "].rows[" + rowIndex + "].fieldValue";
                new_expression = expression.replace(regex, replace_string);
                expression = new_expression;
            }
            else {
                var e = new Object();
                e.message = "there is no field \"{field}\" in the table \"{table}\"".supplant({ table: tableName, field: fieldName}); 
                throw e;
                return;
            }

        }
        else {
            var e = new Object();
            e.message = "there is no table {table} in the current datasource".supplant({ table: tableName });
            throw e;
            return;
        }
    }
    return new_expression
}





