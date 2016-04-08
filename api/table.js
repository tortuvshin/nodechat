/*
	Created by Toroo on 2015/11/2
*/
define(["css!/style.css"], function(){
    var _table_ = "<div toroo-class='table'></div>";
    var table  = function Table(){
    	var own = this;
		own.rows = [];
		own._view = jQuery(_table_);
		table.prototype.append = function(c)    {
            jQuery("table").append(c._view)
        }
		own.addRow = function(){
			var row = {};
			row._view = jQuery(_table_);
			row._view.attr("toroo-class","row");
			own.rows.push(row);
			row.cells = [];
			jQuery(own._view).append(row._view);
		}
		own.addCell = function(row_index){
			var cell = {};
			cell._view = jQuery(_table_);
			cell._view.attr("toroo-class","cell");
			own.rows[row_index].cells.push(cell);
			own.rows[row_index]._view.append(cell._view);
		}
		own.addCellContent = function(row_index,cell_index,c){
			own.rows[row_index].cells[cell_index]._view.html(c._view);
		}
		own.addCellContentOneRow = function(row_index,cell_index,c){
			own.rows[row_index].cells[cell_index]._view.append(c._view);
		}
		
	}
	return table;
});