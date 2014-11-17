

var elementEnum = {
    'image': Image,
    'label': Label,
    'line': Line,
    'data_text': dataText,
    'box': Box,
    'formula': Formula

};


function Element() {
    this.height = "";
    this.width = "";
    this.top = "";
    this.class = "";
    this.left = "";
    this.parent = "";
    
    this._align = "left";
    this._font_size = "14px";
    this._font_color = "#000";
    this._font = "Arial";
    this._font_style = "normal";

    this.__type = "";
    this.__obj_ref = $("<div>");

    Object.defineProperties(this, {
        fontcolor: {
            get: function () {
                return this._font_color
            },
            set: function (value) {
                
                this._font_color = value;
                this.__obj_ref.css('color', value);
            }
        },
        fontsize: {
            get: function () {
                return this._font_size
            },
            set: function (value) {
                this._font_size = value;
                this.__obj_ref.css('font-size', value);
            }
        },
        textalign: {
            get: function () {
                return this._align;
            },
            set: function (value) {
                this._align = value;
                this.__obj_ref.css('text-align', value);
            }
        },
        font: {
            get: function () {
                return this._font;
            },
            set: function (value) {
                this.__obj_ref.css('font-family', value);
                this._font = value;
            }
        },
        fontstyle: {
            get: function () {
                return this._font_style;
            },
            set: function (value) {
                this._font_style = value;

                switch (value) {
                    case "bold":
                        this.__obj_ref.css('font-style', '');
                        this.__obj_ref.css('font-weight', 'bold');
                        break;

                    case "bold_italic":
                        this.__obj_ref.css('font-style', 'italic');
                        this.__obj_ref.css('font-weight', 'bold');
                        break;

                    case "italic":
                        this.__obj_ref.css('font-style', 'italic');
                        this.__obj_ref.css('font-weight', 'normal');
                        break;

                    case "normal":
                        this.__obj_ref.css('font-style', 'normal');
                        this.__obj_ref.css('font-weight', 'normal');
                        break;

                    default:
                        break;

                }
            }
        }
    });
    
}
Element.prototype.createElement = function () { }

Element.prototype.__render = function () {
    var props = "";
    
    for (prop in this) {
        if ((this[prop] instanceof Function) == false && typeof (this[prop]) != 'object') {
            debugger
            props += (" " + prop + "=\'" + (this[prop] == undefined ? "" : this[prop].replace(/\'/g, "")) + "\'");
        }
    }

    return  "<{type} {props} />".supplant({type: this.__type, props:props.trim() });

}
Element.prototype.getElementById = function (id) {

    var element = $('#' + id);

    this.height = element.css('height');
    this.width = element.css('width');
    this.top = element.css('top');
    this.left = element.css('left');
    this.class = element.attr('class');

    this._align = element.css('text-align');
    this._font_size = element.css('font-align');
    this._font_color = element.css('font-color');
    this._font = element.css('font-family');


    this.parent = element.parent();
    this.__obj_ref = element;

    return element;
}
Element.prototype.setAlign = function (align) {
    this.__obj_ref.css('text-align', align);
}
Element.prototype.setFontSize = function (fontsize) {
    this.__obj_ref.css('font-size', fontsize);
}
Element.prototype.setFontColor = function (color) {
    this.__obj_ref.css('color', color);
}
Element.prototype.setFont = function (font) {
    this.__obj_ref.css('font-family', font);
}
Element.prototype.setFontStyle = function (style) {

   
    switch (style) {
        case "bold":
            this.__obj_ref.css('font-style', '');
            this.__obj_ref.css('font-weight', 'bold');
            break;

        case "bold_italic":
            this.__obj_ref.css('font-style', 'italic');
            this.__obj_ref.css('font-weight', 'bold');
            break;

        case "italic":
            this.__obj_ref.css('font-style', 'italic');
            this.__obj_ref.css('font-weight', 'normal');
            break;

        case "normal":
            this.__obj_ref.css('font-style', 'normal');
            this.__obj_ref.css('font-weight', 'normal');
            break;


        default:
            break;

    }
}

function Image() {
    this.bytes = "";
    this.__type = 'rptimage';
    Object.defineProperty(this, "_font_size", { enumerable: false, value:'' });
    Object.defineProperty(this, "_font_color", { enumerable: false, value: "#000000" });
    Object.defineProperty(this, "_font", { enumerable: false, value:'' });
    
}
Image.prototype = new Element();
Image.prototype.createElement = function (target) {
    this.parent = target || this.parent;
    this.__obj_ref = __createImage(target || this.parent, this.width, this.height, this.left, this.top, this);
}
Image.prototype.getElementById = function (id) {
    var element = Element.prototype.getElementById.call(this, id);
    this.bytes = element.find('img').attr('src');
}


function Label() {
    this.text = "";
    this.fontsize = "";
    this.fontcolor = "";
    this.__type = 'label';
}
Label.prototype = new Element();
Label.prototype.createElement = function (target) {
    this.parent = target || this.parent;
    this.__obj_ref =  __createLabel(target || this.parent, this.width, this.height, this.left, this.top, this);
}
Label.prototype.getElementById = function (id) {
    var element = Element.prototype.getElementById.call(this, id);
    this.text = element.text();
    this.fontsize = element.css('font-size');
    this.fontcolor = element.css('color');
    this.textalign = element.css('text-align');
}


function Line() { 
    this.__type = 'line';
}
Line.prototype = new Element();
Line.prototype.createElement = function (target) {
    this.parent = target || this.parent;
    this.__obj_ref =  __createLine(target || this.parent, this.width, this.height, this.left, this.top, this);
}
Line.prototype.getElementById = function (id) {
    Element.prototype.getElementById.call(this, id);
}


function dataText() {
    this.fontsize = "";
    this.fontcolor = "";
    this.text = "no data set";
    this.textalign = "";
    this.datasource = '';
    this.datatype = '';
    this.datavalue = '';
    this.datatable = '';
    this.__type = 'datatext';
}
dataText.prototype = new Element();
dataText.prototype.createElement = function (target) {
    this.parent = target || this.parent;
    this.__obj_ref = __createDatatext(target || this.parent, this.width, this.height, this.left, this.top,this.datasource, this.datatype,this.datavalue,this.datatable, this);
}
dataText.prototype.getElementById = function (id) {
    var element = Element.prototype.getElementById.call(this, id);
    this.text = element.text();
    this.fontsize = element.css('font-size');
    this.fontcolor = element.css('color');
    this.textalign = element.css('text-align');
    
}

function Box() {
    this.fill_color = '';
    this.border_color = '';
    this.__type = 'box';
}
Box.prototype = new Element();
Box.prototype.createElement = function (target) {
    this.parent = target || this.parent;
    this.__obj_ref = __createBox(target || this.parent, this.width, this.height, this.left, this.top, this);
}
Box.prototype.getElementById = function (id) {
    var element = Element.prototype.getElementById.call(this, id);
    this.fill_color = element.css('background-color');
    this.border_color = element.css('border').match(/(\#[0-9A-F]{3,6})|(rgb\(\s?\d{1,3}\s?,\s?\d{1,3}\s?,\s?\d{1,3}\s?\))/ig)[0];
}


function Formula() {
    this.formula_name = "";
    this.formula_code = "";
    this.fontsize = "";
    this.fontcolor = "";
    this.text = "";
    this.__type = 'formula';
}
Formula.prototype = new Element();
Formula.prototype.createElement = function (target) {
    this.parent = target || this.parent;
    this.__obj_ref = __createFormula(target || this.parent, this.width, this.height, this.left, this.top, this);
}
Formula.prototype.getElementById = function (id) {
    var element = Element.prototype.getElementById.call(this, id);
    this.formula_name = element.data('formulaName');
    this.formula_code = element.data('formulaCode');
    this.fontsize = element.css('font-size');
    this.fontcolor = element.css('color');
    this.text = element.text();
}

function Section() {
    this.name = "";
    this.__title = "";
    this.height = "";
    this.parent = "";
    this.suppresed = false;
    this.__obj_ref = "";

    this.elements = [];
   
}
Section.prototype.getSectionByName = function (name) {
    
    var sel = ".section[name={name}]".supplant({ name: name });
    var section = $(sel);
    var sec = this;

    this.name = section.attr('name');
    this.__title = section.attr('title');
    this.height = section.css('height');
    this.parent = section.parent();
    this.suppresed = section.data('suppresed');
    this.__obj_ref = section;
    
    section.find('.element').each(function () {
        
        var current = $(this);
        var _element = new elementEnum[current.attr('element')];
        _element.getElementById(current.attr('id'));
        sec.elements.push(_element);
        
    });

    section.find('.section').each(function () {

        var current = $(this);
        var _section = new Section();
        _section.getSectionByName(current.attr('name'));
        sec.elements.push(_section);

    });

}
Section.prototype.createSection = function (target) {
    debugger
    this.parent = target || this.parent;
    this.__obj_ref = __createSection(target, this.name, this.height, this);
    prepare_section();
}
Section.prototype.supress = function () {
    this.__obj_ref.addClass('supress');
    this.__obj_ref.data('suppresed', true);
    this.__obj_ref.find('.element').resizable();
    this.__obj_ref.find('.element').draggable();
    this.__obj_ref.find('.element').resizable('destroy');
    this.__obj_ref.find('.element').draggable('destroy');
}
Section.prototype.unSupress = function () {
    this.__obj_ref.removeClass('supress');
    this.__obj_ref.data('suppresed', false);
    this.__obj_ref.find('.element').resizable();
    this.__obj_ref.find('.element').draggable();
}
Section.prototype.remove = function () {
    this.__obj_ref.remove();
    //this = undefined;
}
Section.prototype.__render = function () {
    var props = "";
   
    var dum = $("<dum></dum>");
    var section = $("<section name='{name}'></section>\n".supplant({ name: this.name }));
    var elements = $("<elements></elements>");

    for (var i = 0; i <= this.elements.length - 1; i++) {
        debugger
        elements.append(this.elements[i].__render() + '\n');
    }

    section.append(elements);
    dum.append(section);

    return dum.html();

}


function __createSection(target, name, height, obj_element) {
    
    var e_string = "<div title='{n}' name='{n}'  class='section'>".supplant({ n: name });
    var elemnt = $(e_string);
    elemnt.data('obj_element', obj_element);

    return __processElement(target, elemnt, '100%', height, 0, 0, 'section');

}
function createElement(target, type, width, height, left, top, font, font_size, font_style, color, align) {
    var elemnt = "";

    if (type != 'datasource') {

        var obj = new elementEnum[type];
        
        obj.width = width;
        obj.height = height;
        obj.left = left;
        obj.top = top;
        obj.createElement(target);

        obj.font = font;
        obj.fontsize = font_size;
        obj.fontstyle = font_style;
        obj.fontcolor = color;
        obj.textalign = align;
    }
    else {
        __createDatasource(target, width, height, left, top);
    }
}
function __createDatasource(target, width, height, left, top, obj_element) {
         var elemnt = "";
        if ( $( '.datasource' ).length == 0 ) {
            elemnt = $( " <div element='component' title='DataSource' component='datasource' class='component datasource' style='position:static'>" );
        } else {
            elemnt = '';
        }
        elemnt.data('obj_element', obj_element || "");
        return __processElement(target, elemnt, width, height, left, top, 'component');
    }
function __createBox(target, width, height, left, top, obj_element) {
    var elemnt = $("<div title='Box' element='box' class='box element' >");
    elemnt.data('obj_element', obj_element || "");

    return __processElement(target, elemnt, width, height, left, top);
}
function __createLine(target, width, height, left, top, obj_element) {
    var elemnt = '';

    if (width > height) {
        elemnt = $("<div title='Line' type='h' element='line' class='line element' style='border-top:1px solid #000; min-height:10px; max-height:10px;'>");
        height = 10;
    }
    else {
        elemnt = $("<div title='Line' type='v' element='line' class='line element' style='border-left:1px solid #000; min-width:10px; max-width:10px;'>");
        width = 10;
    }

    elemnt.data('obj_element', obj_element || "");

    return __processElement(target, elemnt, width, height, left, top);


}
function __createFormula(target, width, height, left, top, obj_element) {
    var elemnt = '';
    elemnt = $("<label title='Formula' element='formula' formula='' class='formula element'>");
    elemnt.text('not set');

    elemnt.data('obj_element', obj_element || "");

    return __processElement(target, elemnt, width, height, left, top);
}
function __createDatatext(target, width, height, left, top, datasource, datatype, datavalue, datatable, obj_element) {
    var elemnt = '';
    datatype = datatype || 'string';
    datavalue = datavalue || '';
    datatable = datatable || "";
    datasource = (datasource == '' ? 'data not set' : datasource);
    elemnt = $("<label title='Data Text' element='data_text' datasource='' class='data_text element'>");
    debugger
    if (datasource != null && datasource != undefined) {
        elemnt.text('{' + datasource + '}');
        elemnt.attr('datasource', datasource);

        elemnt.data({
            datasource: datasource,
            datatype: datatype,
            datavalue: datavalue,
            datatable: datatable
        });

    } else {
        elemnt.text('data not set');
    }

    elemnt.data('obj_element', obj_element || "");
    return __processElement(target, elemnt, width, height, left, top);
}
function __createImage(target, width, height, left, top, obj_element) {
    var elemnt = '';
    var wrap = $("<div element='image' title='Image' class='img element'>");
    wrap.append("<img element='image' src='' style='width:100%; height:100%'>");
    elemnt = wrap;

    elemnt.data('obj_element', obj_element || "");
    return __processElement(target, elemnt, width, height, left, top);
}
function __createLabel(target, width, height, left, top, obj_element) {
    var elemnt = '';
    
    elemnt = $("<label title='Label' element='label' class='label element'>");
    elemnt.text( obj_element.text || 'Label' + ++$('.label').length);
    
    elemnt.data('obj_element', obj_element || "");
    return __processElement(target, elemnt, width, height, left, top);
}
function __processElement(target, elemnt, width, height, left, top, type ) {
    type = type || 'element';

    if ( type == 'element' ) {
        if ( elemnt != '' ) {
            target.append( elemnt );
            elemnt.css( { width: width, height: height, left: left, top: top });
            elemnt.draggable();
            __generate_id_and_select(elemnt)
        }
    }
    else if ( type == 'component' )  {
        if ( elemnt != '' ) {
            $( '.components_holder' ).append( elemnt );
            $( '.components_holder' ).css( 'display', 'inline-block' );
            $( '.component' ).resizable();
            $( '.component' ).resizable( 'destroy' );
            __generate_id_and_select(elemnt)
        }
    }
    else if (type == 'section')
    {
        if(elemnt != '')
        {
            if (target.hasClass('section') || target.hasClass('workpaper')) {

                target.append(elemnt);
               /* $('.section').resizable();
                $('.section').resizable('destroy');*/
                //__generate_id_and_select(elemnt)
            }
        }
    }

    return elemnt
}
function __generate_id_and_select(elemnt) {
        var uniqueid = generate_uniqueid();

        elemnt.attr( 'id', uniqueid );
        select_element( elemnt );
        select_toolbox_option( 'default' );
    }
function refreshToolbar(element) {

    var obj_element = $(element).data('obj_element');

    var ddlFont = $('#ddlFont');
    var ddlFontStyle = $("#ddlFontStyle");
    var ddlSize = $("#ddlSize");
    var ddlUnit = $("#ddlUnit");
    var picker = $("#picker");

    var size = '';
    var unit = '';
    var mess = '';


    mess = $(element)[0].style.fontSize == "" ? "14px" : $(element)[0].style.fontSize;
    unit = mess.substring(mess.length - 2)
    size = mess.substring(0, mess.indexOf(unit));
   
    ddlFont.val(obj_element.font);
    ddlFontStyle.val(obj_element.fontstyle);
    ddlSize.val(size);
    ddlUnit.val(unit);
    picker.colpickSetColor(obj_element.fontcolor);
    picker.val(obj_element.fontcolor);

    $('[align_prop="{align}"]'.supplant({ align: obj_element.textalign == "" ? "left" : obj_element.textalign })).click();




}
function select_element(element) {

    if (!$(element).parent().hasClass('supress')) {

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

    refreshToolbar(element);
}
function select_element_multi(element)
    {
        if (!$(element).parent().hasClass('supress')) {
            $('.element').resizable();
            $('.element').resizable('destroy');
            $(element).resizable();
            $(element).draggable({ alsoDrag: '.sel_element' });
            $(element).addClass('sel_element');
            sel_type = 'multiple';
        }

        refreshToolbar(element);
}


