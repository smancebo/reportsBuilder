
var mouseStartX = 0;
var mouseStartY = 0;
var mouseEndX = 0;
var mouseEndY = 0;
var marquee = "";
var lbl = '';
var element_data = "";
var clipboard = '';
var sel_section = ''
var drag_obj = new Object();
var sel_type = 'single';
var acelerationx ;
var acelerationy;
var drag_array = [];
var ddltype = '<select id="ddlDatatype" class="dropdownlist" > <option value = "int" >Integer</option><option value="float">Decimal</option><option value = "string" > String </option><option value="datetime">Date Time</option><option value = "bool" > Boolean </option></select>';
var datasource = new dataSource();
var currentTable = new dsTable();

function prepare_section() {


    $(".section").off();
    $(".section").resizable();
    $(".section").resizable('destroy');
    $(".section").resizable();
    create_menu();
    $(".section").attr('drawing', 'false');
    $('.w_mark', '.section').remove();
    $('.section').each(function () {
        var w_mark = $("<span class='w_mark'>");
        w_mark.html($(this).attr('title'));
        $(this).append(w_mark);
        w_mark.css('margin-top', ((80 / 2) - (get_height(w_mark) / 2) + 'px'));
        
    });
    $(".section").on('resize', function (event) {
        var h = get_height($(this));
        $(this).closest('.w_mark').css('margin-top', ((h / 2) - (get_height($(this).find('.w_mark')) / 2) + 'px'));
    });
    $('.section').on('mousedown', function (event) {

        if ($('.li_selected').attr('tag') != 'default' && $(event.target).hasClass('section') && !$(event.target).hasClass('supress')) {
            $(this).attr('drawing', 'true');
            mouseStartX = event.pageX;
            mouseStartY = event.pageY;
            marquee = $("<div class='marquee'>");
            $(event.target).append(marquee);
            marquee.css({ left: event.offsetX + 'px', top: event.offsetY + 'px' });
        }
    });
    $('.section').on('mousemove', function (event) {

        if ($(this).attr('drawing') == 'true' && $('.li_selected').attr('tag') != 'default') {
            var width = event.pageX - mouseStartX;
            var height = event.pageY - mouseStartY;
            marquee.css({ width: width, height: height });
        }
    });
    window.onbeforeunload = function () {
        return 'if you leave all unsaved work will be lost';
    }
    $('.section').on('mouseup', function (event) {


        if ($(this).attr('drawing') == 'true' && mouseStartX < event.pageX) {

            $(this).attr('drawing', 'false');
            mouseEndX = event.pageX;
            mouseEndY = event.pageY;
            var target = $( event.target ).hasClass( 'section' ) ? $( event.target ) : $( event.target ).closest( '.section' );
            var element_type = $('.li_selected').attr('tag');

            var ddlFont = $("#ddlFont");
            var ddlSize = $("#ddlSize");
            var ddlUnit = $("#ddlUnit");
            var ddlFontStyle = $("#ddlFontStyle");
            var picker = $("#picker");
            var align = $('.toolbarulsel');

            createElement(target, element_type, marquee.css('width'), marquee.css('height'), marquee.css('left'), marquee.css('top'), ddlFont.val(), (ddlSize.val() + ddlUnit.val()), ddlFontStyle.val(), picker.val(), align.attr('align_prop'));
        }
        
        try {
            marquee.remove();
        } catch (e) {}
       
    });
    $(document).on("dblclick", ".label", function () {
        var txt = $(this).text();
        lbl = $(this).clone();
        element_data = $(this).data('obj_element');
        //$(this).replaceWith("<input type='text' class='label ninput'/>");
        
        var ninput = $("<input type='text' class='label ninput'/>");
        ninput.data('lbl',$(this));
        ninput.appendTo(sel_section);
        ninput.css({ left: lbl.css('left'), top: lbl.css('top'), width: lbl.css('width'), height: lbl.css('height') });
        ninput.val(txt);
        $(this).hide();

        ninput.on('focus', function () {
            $(this).select();
        });
        ninput.focus();

    });
    $( document ).on( "dblclick", ".img", function () {
        var dvUpImage = $( "#dvUpImage" );
        dvUpImage.attr( 'target', $( this ).attr( 'id' ) );
        dvUpImage.dialog( 'open' );
    });
    $( document ).on( "dblclick", ".datasource", function () {
        var dvdatasource = $( "#dvdatasource" );
        dvdatasource.attr( 'target', $( this ).attr( 'id' ) );
       
        dvdatasource.dialog( 'open' );
    });
    $( document ).on( "dblclick", ".data_text", function () {
        var dvSelectdatasource = $( "#dvSelectdatasource" );
        dvSelectdatasource.data( 'target', $( this ));
        dvSelectdatasource.dialog( 'open' );
    });
    $( document ).on( "dblclick", ".formula", function () {
        var dvFormula = $('#dvFormula');
        dvFormula.data('target', $(this));
        $(this).removeClass('sel_element');
        dvFormula.dialog( 'open' );
    });
    $(document).on('click', '.element', function (e) {
        
        if (!e.ctrlKey) {
            select_element(this);
        }
        else {
            select_element_multi(this);
        }
    });
    $( document ).on( 'click', '.component', function ( e ) {
        select_element( this );
    });
    $(document).on('click', '.section', function (e) {
        sel_section = $(this);
    });
    $(document).off('mousedown','.section');
    $(document).on('mousedown', '.section', function (e) {
        if (e.button == 2) {
            sel_section = $(this);
            
            if ($(this).hasClass('supress')) {
                $("#menu_lnk_supress").find('span').text('Un Supress');
                $("#menu_lnk_supress").data('unsup', true);
            }
            else
            {
                $("#menu_lnk_supress").find('span').text('Supress');
                $("#menu_lnk_supress").data('unsup', false);
            }

            
            if ($(this).hasClass('defsec'))
            {
                $("#dvSecMenu").find("#menu_lnk_del").remove();
            }
            else
            {
                $("#dvSecMenu").find("#menu_lnk_del").remove();
                $("#dvSecMenu").find('#menu_lnk_create').after('<li id="menu_lnk_del"><div class="img_menu" style="background-image:url(images/tbar.png); background-position:-116px -1px;"></div><span>Remove Section</span></li>');
                
            }
            create_menu();
            e.stopPropagation();
        }
    });
    $(document).on('keydown', function (e) {
        var elemnt = $('.sel_element');
        //console.log(e.keyCode);
        if (elemnt.length > 0) {
            switch (e.keyCode) {
                case 46: //del
                    var parent = elemnt.parent();
                    elemnt.remove();
                    select_element(parent.find('.element').first());
                    break;

                case 37: //left
                    elemnt.css('left', (parseFloat(get_left(elemnt)) - 1) + 'px');
                    break;

                case 38: //up
                    e.preventDefault();
                    elemnt.css('top', (parseFloat(get_top(elemnt)) - 1) + 'px');
                    break;

                case 39: //right
                    elemnt.css('left', (parseFloat(get_left(elemnt)) + 1) + 'px');
                    break;

                case 40: //down
                    e.preventDefault();
                    elemnt.css('top', (parseFloat(get_top(elemnt)) + 1) + 'px');
                    break;
                default:

            }
        }

        if (e.keyCode == 67 && e.ctrlKey) {
            clipboard = elemnt.clone();
            clipboard.data('obj_element', clipboard);
            clipboard.css({ left: parseFloat(elemnt.css('left')) + 10, top: parseFloat(elemnt.css('top')) + 10, width: elemnt.css('width'), height: elemnt.css('height'), position: 'absolute' });
        }

        if (e.keyCode == 86 && e.ctrlKey) {
            clipboard.draggable();
            if (clipboard.hasClass('data_text'))
            {
                clipboard.text('data not set');
            }

            if (clipboard.hasClass('formula')) {
                clipboard.text('not set');
            }

            sel_section.append(clipboard.clone().attr('id', generate_uniqueid).css({ left: parseFloat(clipboard.css('left')) + 10, top: parseFloat(clipboard.css('top')) + 10, width: clipboard.css('width'), height: clipboard.css('height'), position: 'absolute' }).draggable());
        }

        if (e.keyCode == 88 && e.ctrlKey) {
            clipboard = elemnt.clone();
            
            clipboard.css({ left: parseFloat(elemnt.css('left')) + 10, top: parseFloat(elemnt.css('top')) + 10, width: elemnt.css('width'), height: elemnt.css('height'), position: 'absolute' });
            elemnt.remove()
        }


    });
    $(document).on('dragstart', '.element', function (e) {
        if (sel_type == 'single') {
            select_element(this);
        }
        else {
            select_element_multi(this);
        }
    });
    $(document).on('resize', '.element', function () {
        $(this).addClass('sel_element');
        var current = $(this);
    });
    $(document).on("blur", "input.ninput", function () {
        var txt = $(this).val();

        //$(this).replaceWith(lbl);
        
        lbl = $(this).data('lbl');
        lbl.text(txt);
        //lbl.draggable();
       // lbl.data('obj_element', element_data);
        $(this).remove();
        lbl.show();
        /*var ninput = $("<input type='text' class='label ninput'/>");
        ninput.data('lbl',$(this));
        ninput.css({ left: lbl.css('left'), top: lbl.css('top'), width: lbl.css('width'), height: lbl.css('height') });
        ninput.val(txt);
        $(this).hide();*/
    });
    $(document).on('mousedown', function (e) {

        if (!$(e.target).hasClass('ui-resizable-handle')) {

            if (sel_type != 'multiple' && !$(e.target).hasClass('element') && !$(e.target).hasClass('colpick_color') && !$(e.target).parent().parent().hasClass('toolbarUl'))
            {
                $('.element').removeClass('sel_element');
                $('.element').resizable();
                $('.element').resizable('destroy');

                $( '.component' ).removeClass( 'sel_element' );
                $( '.component' ).resizable();
                $( '.component' ).resizable( 'destroy' );
            }
            else if (sel_type == 'multiple' && !$(e.target).hasClass('element') && !$(e.target).hasClass('colpick_color') && !$(e.target).parent().parent().hasClass('toolbarUl'))
            {
                $('.element').removeClass('sel_element');
                $('.element').resizable();
                $('.element').resizable('destroy');

                $( '.component' ).removeClass( 'sel_element' );
                $( '.component' ).resizable();
                $( '.component' ).resizable( 'destroy' );
            }
        }

    });
    var waitForFinalEvent = (function () {
        var timers = {};
        return function (callback, ms, uniqueId) {
            if (!uniqueId) {
                uniqueId = "Don't call this twice without a uniqueId";
            }
            if (timers[uniqueId]) {
                clearTimeout(timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
        };
    })();
}
function prepare_toolbox()
    {
        $('.ul_toolbox > li').on('click', function () {
            $(".ul_toolbox > li").removeClass('li_selected');
            $(this).addClass('li_selected');
        
            if ($(this).attr('tag') != 'default')
            {
                $('.section').css('cursor', 'crosshair');
            }
            else
            {
                $('.section').css('cursor', 'default');
            }
        });
    }
function get_height(elemnt){
        return elemnt.css('height').substring(0, elemnt.css('height').indexOf('px'))
    }
function get_width(elemnt) {
        return elemnt.css('width').substring(0, elemnt.css('width').indexOf('px'))
    }
function get_top(elemnt) {
        return elemnt.css('top').substring(0, elemnt.css('top').indexOf('px'))
    }
function get_left(elemnt) {
        return elemnt.css('left').substring(0, elemnt.css('left').indexOf('px'))
    }
function select_toolbox_option(option)
    {
        $('.ul_toolbox > li[tag=' + option + ']').click();
    }
function get_random_range(max,min)
    {
        return Math.random() * (max - min) + min;
    }
function generate_uniqueid() {
        return "element_" + (new Date().getTime());
    }
function is_negative(number) {
        if (number < 0) {
            return true;
        }
        else
        {
            return false;
        }
    }
function get_differential(cordinate, start) {
        if (cordinate < start) {
            return -1
        }
        else if (cordinate > start) {
            return 1;
        }
        else
        {
            return 0;
        }
        
    }
function Upload_Files() {

    try {
        var data = new FormData();

        /*window.onbeforeunload = function () {
            return 'La carga de Archivos aun no se ha completado';
        }*/

            $.each( $( "#fileupload" )[0].files, function ( i, file ) {
            data.append( "file" + i, file );
        });

        CalluploaderHandler( data );

    }
    catch ( e ) {
        alert( 'Browser not supported' )
        }
}
function CalluploaderHandler( d ) {
    $( "#imgAjax" ).css( 'display', 'inline' );
    $.ajax( {
        data: d,
        cache: false,
        type: "POST",
        url: "/parseimg",
        contentType: false,
        processData: false,
        success: OnComplete,
        error: OnFail
    });
    return false;
}
function OnComplete( response ) {
        
        var dvUpImage = $( "#dvUpImage" );
    $( "#imgAjax" ).hide();

    $( "#" + dvUpImage.attr( 'target' ) ).find('img').attr( 'src', response );


    //window.onbeforeunload = null;

    dvUpImage.dialog( 'close' );
}
function OnFail( result ) {
    alert( 'Request failed' );
}


//Datasource

function show_close_mod_table(sender) {
            console.log($(sender).closest('.mod_table'));
        }
function create_table() {
    var txt_table_name = $("#txt_table_name");
    var tabTables = $("#tabTables");

    var dt = datasource.tables.getTable(txt_table_name.val());

    if (dt == undefined) { // if not exist one table with the same name


        tabTables.find('#ulTables').append('<li><a href="#' + txt_table_name.val() + '">' + txt_table_name.val() + '</a></li>');
        var div = $("<div id='" + txt_table_name.val() + "' class='tab_container'>");
        var table = $("<table class='mod_table'>");
        table.append("<thead><tr><th>Field Name</th><th>Data Type</th></tr></thead>");
        table.append('<tr class="tr_add"><td><input type="text" id="txt_field_name" name="txt_field_name" class="textbox" /></td><td>' + ddltype + '</td><td><input type="button" value="Add" onclick="add_row(this)" /></td></tr>');
        div.append(table);

        if (tabTables.find('.tab_container').length == 0) {
            $('#ulTables').after(div);
        }
        else {
            tabTables.find('.tab_container').last().after(div);
            tabTables.tabs('destroy');
        }

        tabTables.tabs({
            activate: function (event, ui) {

                var tab = ui.newTab;
                currentTable = datasource.tables.getTable(ui.newTab.text());

            }
        });

        table.append('<tr><td colspan="2"><a onclick="remove_current_table()" style="color:blue; font-size:small; text-decoration:underline; cursor:pointer">Remove Table</a></td></tr>')

        $('#dvCreatetable').dialog('close');
        $('#dvdatasource').css('height', '');

        $('.mod_table').on('dblclick', '.fieldtype', function () {
            blur_ddltype('.fieldtype');
            blur_txtedit('.fieldname');
            var ddl = $(ddltype);
            ddl.addClass('mod_table_ddltype');
            ddl.data('lbl', $(this));
            $(this).replaceWith(ddl);
            ddl.val($(this).attr('type')).focus().select();
        });

        $('.mod_table').on('dblclick', '.fieldname', function () {
            blur_txtedit('.fieldname');
            blur_ddltype('.fieldtype');

            var txt = $('<input type="text" class="mod_table_txtedit">');
            txt.data('lbl', $(this));
            $(this).replaceWith(txt);
            txt.val($(this).text()).focus().select();
        });

        $('.mod_table').on('blur', '.mod_table_txtedit', function () {
            blur_txtedit(this);
        });

        $('.mod_table').on('blur', '.mod_table_ddltype', function () {
            blur_ddltype(this);
        });

        $('.mod_table').on('mouseenter', '.row_table', function () {
            $(this).find('.row_rm').fadeIn('fast');
        });

        $('.mod_table').on('mouseleave', '.row_table', function () {
            $(this).find('.row_rm').fadeOut('fast');
        });



        $("#txt_field_name").focus();

        var table = new dsTable();
        table.tableName = txt_table_name.val();
        datasource.tables.add(table);

        if (currentTable.tableName == '') {
            currentTable = table;
        }
        txt_table_name.val('');
    }
    else
    {
        alert('there is a table with that name already');
        $("#dvCreatetable").dialog('close');
    }

}
function remove_current_table() {
            if ( confirm( 'Are you sure to do this operation?' ) ) {
                debugger
                var tablename = currentTable.tableName;
                var existing_dt = $( '.data_text' ).filter( function () {
                    return $( this ).data( 'datatable' ) == tablename;
                });

                if ( existing_dt.length > 0 ) {
                    if ( confirm( 'there are datatext that are associated with this table, removing the table will remove associated components, are you sure you want to continue? ' ) ) {
                        existing_dt.remove();
                        do_table_remove();
                    }
                }
                else {
                    do_table_remove();
                }
            }
        }
function do_table_remove() {
    var tablename = currentTable.tableName;
    var tabTables = $( '#tabTables' );

    var li = tabTables.find( '#ulTables' ).find( 'li' ).filter( function () {
        return $( this ).text() == tablename;
    });

    var div = tabTables.find( '#' + tablename );

    li.remove();
    div.remove();

    datasource.tables.remove( tablename );

    tabTables.tabs( 'destroy' );
    
    if ( datasource.tables.length > 0 ) {
        tabTables.tabs();
    }
}
function blur_ddltype(sender) {
            try {

                var lbl = $(sender).data('lbl');
                lbl.text($(sender).find(':selected').text());
                lbl.attr('type', $(sender).find(':selected').val());
                $(sender).replaceWith(lbl);
            }
            catch (e) { }
        }
function blur_txtedit(sender) {
            try{
                var lbl = $(sender).data('lbl');
                lbl.text($(sender).val());
                $(sender).replaceWith(lbl);
            }
            catch(e){}
        }
function add_row( sender ) {
            var mod_table = $( sender ).closest( '.mod_table' );
            var tr_add = mod_table.find( '.tr_add' );
            var txt_field_name = tr_add.find( "#txt_field_name" );
            var ddlDatatype = tr_add.find( "#ddlDatatype" );


            var tr = $( "<tr class='row_table'>" );
            var del_btn = $( "<img class='row_rm' src='images/delete.png' onclick='remove_row(this)'>" );


            tr.append( "<td><label class='fieldname'>" + txt_field_name.val() + "</label></td><td><label class='fieldtype' type='" + ddlDatatype.find( ':selected' ).val() + "'>" + ddlDatatype.find( ':selected' ).text() + "</label></td><td class='td_del'></td>" );
            tr.find( '.td_del' ).append( del_btn );

            if ( mod_table.find( '.row_table' ).length == 0 ) {
                mod_table.find( 'thead' ).after( tr );
            }
            else {
                tr_add.before( tr );
            }

            var row = new dsRow( txt_field_name.val(), ddlDatatype.find( ':selected' ).val() );

            currentTable.rows.add( row );
            del_btn.data( 'row', row );

            txt_field_name.val( '' );
            txt_field_name.focus();

            $( '.mod_table' ).find( '.fieldname' ).draggable( {
                revert: "invalid",
                helper: "clone",
                appendTo:'.workpaper',
                cursor: "move"
            });

            $('.section').droppable( {
                accept: ".fieldname",
                activeClass: "droppable",
                drop: function (event, ui) {
                    var width = ui.helper.css('width');
                    var height = ui.helper.css('height');
                    var left = ui.helper.css('left');
                    var top = get_top(ui.helper) - $(this).position().top;

                    var datatext = new dataText();

                    datatext.text = ui.helper.text(),
                    datatext.width = width;
                    datatext.height = height;
                    datatext.top = top;
                    datatext.left = left;
                    datatext.datasource = ui.helper.text();
                    datatext.datatype = row.fieldType;
                    datatext.datavalue = row.fieldValue;
                    datatext.datatable = currentTable.tableName;

                    datatext.createElement($(this));

                    //createDatatext($(this), width, height, left, top, ui.helper.text(), row.fieldType, row.fieldValue, currentTable.tableName);
                    ui.helper.remove();
                }
            });
        }
function remove_row(sender) {
            currentTable.rows.remove($(sender).data('row'));
            $(sender).parent().parent().remove();
        }
function createdsOpen() {
    var ddlTables = $( "#ddlTables" );
    var ddlFields = $( '#ddlFields' );
    ddlTables.html( '' );
    ddlTables.append( "<option value='0'>Choose one...</option>" );
    ddlTables.unbind( 'change' );
    ddlTables.on( 'change', function () {

        var tbl = datasource.tables.getTable( $( this ).val() );

        ddlFields.html( '' );
        ddlFields.append( "<option value='0'>Choose one...</option>" );

        for ( var i = 0; i <= tbl.rows.length - 1; i++ ) {
            var row = tbl.rows[i];

            var option = $( "<option>" );
            option.attr( 'value', row.fieldName );
            option.text( row.fieldName );
            option.data( {
                fieldType: row.fieldType,
                fieldName: row.fieldName,
                fieldValue: row.fieldValue,
                DataTable: $( this ).find( 'option:selected' ).val()
            });

            ddlFields.append( option );
        }

    });

    for ( var i = 0; i <= datasource.tables.length - 1; i++ ) {
        ddlTables.append( "<option value='" + datasource.tables[i].tableName + "'>" + datasource.tables[i].tableName + "</option>" );
    }

    var target = $( this ).data( 'target' );
    ddlTables.val( target.data( 'datatable' ) );
    ddlTables.change();
    ddlFields.val( target.data( 'datasource' ) )
}
function set_datasource() {
    var dvSelectdatasource = $( "#dvSelectdatasource" );
    var target = dvSelectdatasource.data( 'target' );
    var ddlFields = $( '#ddlFields' );
    var row = ddlFields.find( 'option:selected' );

    target.data( {
        datatype: row.data( 'fieldType' ),
        datasource: row.data( 'fieldName' ),
        datavalue: row.data( 'fieldValue' ),
        datatable: row.data( 'DataTable' )
    });

    target.text( '{' + row.data( 'fieldName' ) + '}' );
    dvSelectdatasource.dialog( 'close' );

}
function set_formula(target) {
    var txt_formula_name = $("#txt_formula_name");
    var txt_formula_code = $("#txt_formula_code");

    txt_formula_name.val(txt_formula_name.val().replace(/[!@#$%^&*()]/, ''))

    var ext_formula = $('.formula').filter(function () {
        return $(this).data('formulaName') == txt_formula_name.val();
    });


    if (ext_formula.length > 0 && ext_formula.attr('id') != target.attr('id')) {
        alert('a formula already exists with that name');
        txt_formula_name.focus();
        return;
    }

    if (txt_formula_name.val() == '') {
        alert('Formula name is required!');
        txt_formula_name.focus();
        return;
    }

    if (txt_formula_name.val().indexOf(' ') != -1) {
        alert('Formula name can\'t contain white spaces');
        txt_formula_name.focus();
        return;
    }

    if (txt_formula_code.val() == '') {
        var conf = confirm('there no text in the formula code, do you want save it anyway?');

        if (conf) {
            do_save_formula(target);
            return;
        }
    }
    else {
        var code = clean_code(txt_formula_code.val());
        try {
            txt_formula_code.val(clean_code(txt_formula_code.val().trim()));
            var formula = new Function(parseExpression(code));
            formula();
            do_save_formula(target);

        } catch (e) {
            console.log(e);
            if (confirm('there are syntax error in your formula \"{error}\" , save it anyway?'.supplant({ error: e.message }))) {
                do_save_formula(target);
                return;
            }
            txt_formula_code.focus();
        }
    }
}
function do_save_formula(target) {
    var txt_formula_name = $("#txt_formula_name");
    var txt_formula_code = $("#txt_formula_code");
    var code = clean_code(txt_formula_code.val().trim());
    txt_formula_code.val(code);


    target.text('@' + txt_formula_name.val());
    target.data({
        formulaName: txt_formula_name.val().trim(),
        formulaCode: code
    });

    txt_formula_name.attr('readonly', 'readonly');
    alert('formula saved!');
}
function clean_code(code) {
    var regex = /((alert|confirm|prompt|eval)(\s+)?\(('|")(.+)?('|")\);?)/ig;
    return code.replace(regex, '').replace("'", "\'");
}
function createFormulaOpen() {
    var target = $(this).data('target');

    var txt_formula_name = $("#txt_formula_name");
    var txt_formula_code = $("#txt_formula_code");

    if (target.data('formulaName') == undefined) {
        txt_formula_name.removeAttr('readonly');
        txt_formula_name.val('');
        txt_formula_code.val('');
        txt_formula_name.focus();
    }
    else {
        txt_formula_name.text('@' + target.data('formulaName'));
        txt_formula_name.attr('readonly', 'readonly');
        txt_formula_name.val(target.data('formulaName'));
        txt_formula_code.val(target.data('formulaCode'));
    }
}
function Initialize()
{
  
    prepare_section();
    prepare_toolbox();
    //create_menu();
    $('#picker').colpick({
        layout: 'hex',
        submit: 0,
        //colorScheme: 'dark',
        color:'#000000',
        onChange: function (hsb, hex, rgb, el, bySetColor) {
            var color = '#' + hex;
            $(el).css('border-color', color);
            if (!bySetColor) $(el).val(color);

            $('.sel_element').each(function(){
                 var element = $(this).data('obj_element');
                if (element != undefined) element.fontcolor = color;
            });

           
        }
    }).keyup(function () {
        $(this).colpickSetColor(this.value);
    });
    $('#picker').val('#000000')
    $('#dvUpImage').dialog({ autoOpen: false, width: '310px', height: '110px', resizable: false, modal: true });
    $('#dvCreatetable').dialog({ autoOpen: false, width: '160px', height: 140, resizable: false, modal: true });
    $('#dvCreateSection').dialog({ autoOpen: false, width: '160px', height: 140, resizable: false, modal: true });
    $('#dvSelectdatasource').dialog({ autoOpen: false, width: 160, height: 165, resizable: false, modal: true, open: createdsOpen });
    $('#dvdatasource').dialog({ autoOpen: false, width: 385, height: 'auto', resizable: false, modal: false });
    $('#dvFormula').dialog({ autoOpen: false, width: 385, height: 'auto', resizable: false, modal: true, open: createFormulaOpen, beforeClose: createFormulaClose });
}

function changeFontSize()
{
    
    var ddlSize = $("#ddlSize");
    var ddlUnit = $("#ddlUnit");

    var font_size = ddlSize.val() + ddlUnit.val();

    $('.sel_element').each(function () {
        
        var element = $(this).data('obj_element');
        if(element!=undefined) element.fontsize = font_size;
    });
}

function changeFont(sender) {
    $('.sel_element').each(function () {
        var element = $(this).data('obj_element');
        if (element != undefined) element.font = $(sender).val();
    });
}

function changeAlign(sender)
{
    $('.sel_element').each(function () {
        var element = $(this).data('obj_element');
        if (element != undefined) element.textalign = $(sender).attr('align_prop');
    });

    $('.toolbarulsel').removeClass('toolbarulsel');
    $(sender).addClass('toolbarulsel');
}

function changeFontStyle(sender) {
    $('.sel_element').each(function () {
        var element = $(this).data('obj_element');
        if (element != undefined) element.fontstyle = $(sender).val();
    });
}

function createFormulaClose() {
    var txt_formula_code = $("#txt_formula_code");

    if (txt_formula_code.val() != ($(this).data('target').data('formulaCode') == undefined ? '' : $(this).data('target').data('formulaCode'))) {
        return confirm('all unsaved work will be deleted, do you want to proceed?');
    }
    return true;
}
function create_menu() {


    $('.element').unbind('contextmenu');
    $('.element').contextMenu('dvElementMenu', {
        bindings: {
            'lnk_align_left': function (t) {
                alert('left');
            },
        }

    });
    

    $('.section').unbind('contextmenu');
    $('.section').contextMenu('dvSecMenu', {
        bindings: {
            'menu_lnk_create': function (t) {
                $('#dvCreateSection').dialog('open');
            },

            'menu_lnk_del': function (t) {
                var section = new Section();
                section.getSectionByName($(t).attr('name'));
                section.remove();
            },

            'menu_lnk_supress': function (t) {
                var section = new Section();
                section.getSectionByName($(t).attr('name'));
                
                if (!$('#menu_lnk_supress').data('unsup')) {
                    section.supress();
                }
                else {
                    section.unSupress();
                }

                

            }
        },
        menuStyle: {
            width: '190'
        },

        itemHoverStyle: {
            border: '1px solid #fbe3a3',
            backgroundColor: '#fbe3a3',
            cursor: 'pointer'
        }
    });
}
function create_section(name) {

    var section = new Section();
    section.name = name;
    section.createSection(sel_section);
    $("#dvCreateSection").dialog('close');
}

function xmlToString(xmlData) { 

    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}   


/*function select_element(element) {
    $('.element').resizable();
    $('.element').resizable('destroy');
    $('.element').removeClass('sel_element');

    if ($(element).attr('element') != 'component') {
        $(element).resizable();
        $(element).draggable();
    }
    
    $(element).addClass('sel_element');
    sel_type = 'single';
}

function select_element_multi(element)
{
    
    $('.element').resizable();
    $('.element').resizable('destroy');
    $(element).resizable();
    $(element).draggable({ alsoDrag: '.sel_element' });
    $(element).addClass('sel_element');
    sel_type = 'multiple';
}*/

