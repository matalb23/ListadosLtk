var COL_TH_MAS_INFO = "+Info";

var _clave = "";
var _params = "";
var _url = "";
var _consultas = [];

//para que no tarde el click
window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);

function actualizar(){

	obtener_consultas();

//obtener_links();

	//$.mobile.changePage( "#page-principal", { transition: "slideup", changeHash: true });
	$.mobile.changePage( "#page-principal", { transition: "slideup", changeHash: true });
	};




function ws_leer_url(){
	var url =acceso_ws_get_url();
	//alert("leido " + url);
	$("#url_ws").val(url);
};


function ws_validar_clave(){
	var url  = $("#url_ws").val();
	acceso_ws_set_url(url);

	alert(url + " - Guardado!.");
	$.mobile.changePage( "#page-principal", { transition: "slideup", changeHash: true });
};

function row_datos_nueva(dato){
	return "<td class='row-dato'>" + dato + "</td>";
};

function ajax_cargar(url, params, nombre, id_tabla, consulta ){
	//alert("params:::::::::"+params);
	//alert("url:::::::::"+url);
	var ajax = $.ajax({
	url: url,
	data: params,
	type: 'POST',
	contentType: "application/json; charset=utf-8",
	async: false,
	dataType: 'json',
	beforeSend: function () {
		$("#estado").html("Actualizando "+ nombre +" ...");
		//alert("before send");
	}
    });
    ajax.done(function (response) {
		//alert("DONEEEEE");
		//alert(response);
		var resultado_json = $.parseJSON(response.d);
		//codigo | descripcion | resultado
		//alert("codigo: " + resultado_json.codigo);
		//alert("descripcion: " + resultado_json.descripcion);
		//alert("resultado: " + resultado_json.resultado);

		if(resultado_json.codigo !=100){//100 es ok
			var msj_error ;

			msj_error = "WSError codigo: " + resultado_json.codigo + "\n";
			msj_error = msj_error + "WSError Desc: " + resultado_json.descripcion;
			alert(msj_error);
			/*
			alert("res: " + resultado_json);
			for(var d in resultado_json){
				alert(d);
				alert(resultado_json[d]);
			}
			*/
		}else{


			//alert(resultado_json);
			//alert("fin ok--------------------------------");
			//onDone(resultado_json.resultado, id_tabla);
			/////////////////////////////////////////////////////////////////
			//limpio la tabla
			$("#" + id_tabla + " tbody").empty();
			//$("#tbodyid").empty();
			var primera_vez = true;


			var columnas = [];

			/*traigo las columnas del th para saber el orden en el que se tienen que cargar los datos*/
			var col_codigo;//el campo donde esta la columna codigo
			var tmp_col;
			$("#"+id_tabla + " thead th").each(function( index ) {

				tmp_col = $(this);
				var tmp_col_txt = tmp_col.text().replace(/\s+/g, '').toLowerCase();

				if( tmp_col_txt!=COL_TH_MAS_INFO.toLowerCase()){
					//alert( index + ": " + $(this).text() );
					columnas.push($(this).text());
					//columnas.push(tmp_col_txt);

					if(tmp_col.hasClass("ver_notas_codigo")){
						col_codigo = tmp_col_txt;
						//alert("Tienen clase ver_nota-codigo col: " + col_codigo);
					}
					//col = columnas[columna].replace(/\s+/g, '').toLowerCase();
				}
				});

			//alert(columnas.join("-"));
			var data = resultado_json.resultado;
			if(data.length == 0 )
				alert("Sin datos");

			//alert("consulta.desgloseVista:"+consulta.desgloseVista);
			//alert("consulta.desgloseTipo:"+consulta.desgloseTipo);

			for (var i = 0; i < data.length; i++) {
				var rowData = data[i];
				//alert("rowData: " + rowData);
				var row = $("<tr/>");
				var col;
				if(primera_vez){
					//row.append($("<td class='primera'>  </td>"));
					$("#"+id_tabla).append("<tr class='primera'></tr>");
					primera_vez = false;
				}

				for(var columna in columnas){
					/*
					 * esto es porque cuando lee las descripciones estan separadas por espacios y en el vector tienen que tener el nombre exacto
					 * Ej: Fecha Inicio => vector[Fecha Inicio] y deberia ser Fecha Inicio  => vector[fechainicio]
					 */
					col = columnas[columna].replace(/\s+/g, '').toLowerCase();

					row.append($(row_datos_nueva(rowData[col])));



					/*
					alert("columna: " + columna);
					alert("col:::"+col);
					alert("primero");
					for(var key in rowData) {
					    alert('----key: ' + key + '\n' + '----value: ' + rowData[key]);
						//rowData[key] = rowData[key].toLowerCase();
						key = key.toLowerCase();
					}
					alert("segundo");
					for(var key in rowData) {
					    alert('----key: ' + key + '\n' + '----value: ' + rowData[key]);
						//rowData[key] = rowData[key].toLowerCase();
					}
					alert("fin segundo ");

					alert("rowData[col]:::"+rowData[col]);
					alert("rowData[columna]:::"+rowData[columna]);
					*/

					/*
					if(rowData[col]!=null){
						alert(columnas[columna] + ": " + rowData[col]);
						//row.append($("<td>" + rowData[col] + "</td>"));
						row.append($(row_datos_nueva(rowData[col])));
					}
					else{
						if(rowData!='[object Object]'){
							alert("NULLLL " + col);
							//row.append($("<td>" + rowData + "</td>"));
							row.append($(row_datos_nueva(rowData)));
						}else{
							//si viene por aca es porque el campo no existe en la consulta que devuelve el ws
							alert("col_codigo: " + col_codigo + " - rowData[col_codigo]: " + rowData[col_codigo]);
							var ver_click = "<div onclick=\"mostrar_nota_servicio('"+rowData[col_codigo]+"')\" class='btn_ver_notas'>Notas</<div>";
							row.append($("<td>" + ver_click+ "</td>"));
						}
					}
					*/
				}//fin for

				if(consulta.desgloseTipo!=""){
						//agrego la columna para hacer click
						//row.append($( "<td class='row-dato'>" + dato + "</td>";));
						var ver_click = "<div onclick=\"mas_info("+consulta.codigo+", '"+consulta.desgloseTipo+"', '"+rowData[col_codigo]+"', '"+consulta.desgloseColumnaUnica+"', '"+consulta.columnaCodigo+"')\" class='btn_ver_notas'>(*)</<div>";
						//alert("ver_click:"+ver_click);
						row.append($("<td>" + ver_click + "</td>"));
					}

				$("#"+id_tabla).append(row);
			}
			if(!primera_vez){//si es falso, tiene datos, agrego la ultima fila
				$("#"+id_tabla).append("<tr class='ultimo'></tr>");
			}
			//row.append($("<td>  </td>"));
			//alert("TERMINADO " + nombre);
			////////////////////////////////////////////////////////////////
			//$("#estado").html(nombre + " OK");
			$("#estado").html("Latika Developer Team");

			//$("#"+id_tabla).table("refresh");
		}


    });
    ajax.fail(function (xhr, status) {
		$("#estado").html( nombre + " ERROR");
        alert("faillll-" + status + " - Url: " + url + " - params: " + params);
		if(xhr!=null)
			alert("xhr.responseText:"+xhr.responseText);
    });
    ajax.always(function () {
		//alert("allways");
		//$("#estado").html("OKOKOK");

    });

};

function ejecutar_ajax_ws(url, params, nombre, procesar){
	var ajax = $.ajax({
	url: url,
	data: params,
	type: 'POST',
	contentType: "application/json; charset=utf-8",
	async: false,
	dataType: 'json',
	beforeSend: function () {
		$("#estado").html("Actualizando "+ nombre +" ...");
		//alert("bofre");
	}
    });
    ajax.done(function (response) {
		//alert("DONEEEEE");
		//alert(response);
		var resultado_json = $.parseJSON(response.d);
		//codigo | descripcion | resultado
		//alert("codigo: " + resultado_json.codigo);
		//alert("descripcion: " + resultado_json.descripcion);
		//alert("resultado: " + resultado_json.resultado);
		if(resultado_json.codigo !=100){//100 es ok
			var msj_error ;

			msj_error = "WSError codigo: " + resultado_json.codigo + "\n";
			msj_error = msj_error + "WSError Desc: " + resultado_json.descripcion;
			alert(msj_error);
			/*
			alert("res: " + resultado_json);
			for(var d in resultado_json){
				alert(d);
				alert(resultado_json[d]);
			}
			*/
		}else{

			procesar(resultado_json.resultado);
			//alert("TERMINADO " + nombre);
			////////////////////////////////////////////////////////////////
			//$("#estado").html(nombre + " OK");
			$("#estado").html("Latika Developer Team");
			//$("#"+id_tabla).table("refresh");
		}


    });
    ajax.fail(function (xhr, status) {
		$("#estado").html( nombre + " ERROR");
        alert("faillll-" + status + " - Url: " + url + " - params: " + params);
    });
    ajax.always(function () {
		//alert("allways");
		//$("#estado").html("OKOKOK");

    });
}


//consulta.prop: {codigo, nombreTabla, nombreAMostrar, filtro, orden, ordenBy}
function consulta_agregar_en_menu(consulta){

	var nueva_consulta = "<li><button class='btn btn-primary btn-sh-primary ui-btn ui-shadow ui-corner-all'  onclick='conexion_click()'  id='" + consulta.id + "' >"+consulta.nombre+"</button></li>";
	$("#main-ul-consultas-disponibles").append(nueva_consulta);

}






function obtener_consultas(){

	function _proceso_agregar_consultas(resultado){
	//	alert("proceasndoooo" + tabla);

		_consultas = resultado;

		if(_consultas.length>0){
			for (var i = 0; i < _consultas.length; i++) {
				//alert("varr " + i);
				var consulta = _consultas[i];

				consulta_agregar_en_menu(consulta);

			}
		}

	}
	var url = _url + "/consultasws.asmx/ObtenerConexiones";

	ejecutar_ajax_ws(url, _params, "Cargando consultas", _proceso_agregar_consultas);





}

function consulta_get_id_tabla_html(consulta){
	 return consulta_get_id_html(consulta)+"-tabla";
}
function consulta_get_id_html(consulta){
	return "page-"+consulta.nombreTabla + "-" + consulta.codigo;
}

function sql_query_agregar_condicion_si_corresponde(campo, tipo, condicion, valor){
	var where = "";
	if(valor!=""){
		//si es un int
		if(tipo.indexOf("int") >= 0 ){
			//where = where + campo + " = \'"+-1+"\' and ";
			switch(condicion){
			case "1":// int e igual =
				where = where + campo + " = "+valor+" and ";
				break;
			case "2"://int like '%' NO IMPLEMENTADO
				//here = where + campo + " like '+"valor"+%' ";
				break;
			}
		}else{
			//es un string!
			switch(condicion){
			case "1":// string e igual =
				where = where + campo + " = '"+valor+"' and ";
				break;
			case "2"://string like '%%'
				where = where + campo + " like '%"+valor+"%' and ";
				break;
			}
		}
	}
	return where;
}



$(document).ready(function(){
	//alert("ready-indexok.js");
	_clave = acceso_ws_get_clave();
	_params = "{acceso: '"+_clave+"'}";
	_url = acceso_ws_get_url();
	//alert("_url:"+_url);
	_consultas = [];

	actualizar();


});
