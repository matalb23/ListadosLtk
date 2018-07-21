var COL_TH_MAS_INFO = "+Info";
//consulta.prop: {codigo, nombreTabla, nombreAMostrar, filtro[]{.nombre, tipo, filtrar:bool }, orden, ordenBy, columnaCodigo}
var _clave = "";
var _params = "";
var _url = "";
var _consultas = [];

//para que no tarde el click
window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);

function actualizar(){
/*
	var params = $("#param-ok").val();	
	function _proc(resultado){	alert("proceasndoooojjjjjjjjj ok " + params);}
	var url = _url + WS_OBTENERTABLA;
	alert("antes ajax");
	ejecutar_ajax_ws(url, params, "Cargando consultas", _proc);
	alert("despues ajax");*/
////////////////////////////////////////////////////
	//$.mobile.changePage( "#page-loading", { transition: "slideup", changeHash: true });

	obtener_consultas();
	
	obtener_links();

	$.mobile.changePage( "#page-principal", { transition: "slideup", changeHash: true });

	};

function obtener_links(){
	var url = _url + WS_OBTENERLINKS;
	function _proceso_agregar_link(resultado){
		//alert("resultado:"+resultado);

		if(resultado.length>0){
			//agrego un separador
			$("#main-ul-consultas-disponibles").append("<li data-role='list-divider' >Links</li>");
			
			for (var i = 0; i < resultado.length; i++) {
				//alert("varr " + i);
				var link = resultado[i];
				//alert("link:"+link);				
				link_agregar_en_menu(link);
				//for(var key in rowData) alert('----key: ' + key + '\n' + '----value: ' + rowData[key]);				
				//alert( rowData);

			}
		}
	}
	ejecutar_ajax_ws(url, _params, "Cargando Links", _proceso_agregar_link);
}

//consulta.prop: {codigo, nombreTabla, nombreAMostrar, filtro, orden, ordenBy}
function link_agregar_en_menu(link){
	var nuevo_link;
	//nuevo_link = "<li> <a href='#' onclick='window.open('"+link.url+"', '_system');'>"+link.nombre+"</a> </li>";
	
	nuevo_link = "<li> <a href='#' onclick=\"window.open('"+link.url+"', '_system');\">"+link.nombre+"</a> </li>";
	//alert(nuevo_link);
	$("#main-ul-consultas-disponibles").append(nuevo_link);
}
function ws_leer_url(){
	var url =acceso_ws_get_url();
	alert("leido " + url);
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
						row.append($("<td>" + ver_click+ "</td>"));							
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
			$("#estado").html("LatikaIT");

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

function mas_info(consulta_codigo, tipo, codigo_a_buscar, columna_unica, columna_codigo){
	//alert("columna_unica:"+columna_unica);
	//selecciono codigo    
    //var _url = "/serviciows.asmx/ObtenerNotasDeServicio";    
    //ajax_mostrar_notas(servicio);
    var url;
    var params;
    if(tipo!=''){
    	//ajax_mas_info_alert(servicio);
    	url = _url + WS_MASINFO_SIMPLE;
    	params = "{acceso:'"+acceso_ws_get_clave() + "', consulta_codigo:"+consulta_codigo+", codigo_a_buscar:'"+codigo_a_buscar+"'}";
    	//params = _params;
    	function _procesar_mas_info(resultado){
    		//alert("resultado:"+resultado);
			//alert("resultado.toLowerCase:"+resultado[0][columna_unica.toLowerCase()]);			
			if(columna_unica!=''){
				var notas = "";
	            for (var i = 0; i < resultado.length; i++) {
	                notas = notas + resultado[i][columna_unica.toLowerCase()] + "\n";
	            }	                
	            if (notas == ""){
	                alert("Mas Info: " + "\n" + "Sin Info");
	            }
	            else{
	                //alert("Mas Info: " + "\n" + notas);
					$("#page-mas-info-simple #lbltextarea").html(columna_unica);
	                $("#page-mas-info-simple #textarea").val(notas);
	                $("#page-mas-info-simple-titulo").html("Mas Info - Buscar Por: " + codigo_a_buscar);
					$.mobile.changePage( "#page-mas-info-simple", { transition: "slideup", changeHash: true });
	            }
			}else{
				var html;
				//Tiene una tabla a mostrar
				$("#page-mas-info-tablas-main").empty();
				//alert("resultado:"+resultado);
				for (var i = 0; i < resultado.length; i++) {
	                //notas = notas + resultado[i][columna_unica.toLowerCase()] + "\n";
	                html = "<div class='ui-field-contain'>";
	                for(var key in resultado[i]) {
					    //alert('----key: ' + key + '\n' + '----value: ' + resultado[i][key]);					    
					    //html+= "<label for='"+key+"'>"+key+"</label>";
					    html+= "<div class='ui-field-contain'>";
					    if(key.toLowerCase() == columna_codigo.toLowerCase() )
					    	//html+= "<h2 >"+key+": </h2>";
					    html+= "<span ><strong>"+key+": </strong></span>";
					    else{
					    	//alert("key:"+key+", colcodigo:"+columna_codigo);
					    	html+= "<span >"+key+": </span>";
					    }
					    //html+= "<input type='text' name='"+key+"' value='"+resultado[i][key]+"'/>";
					    html+= "<span><strong>"+resultado[i][key]+"</strong></span>";
					    html+= "</div>";						
					}
					//html += "<hr noshade/>";						
					html += "</div>";						
					//alert(html);
					$("#page-mas-info-tablas-main").append(html);
	            }
	            $("#page-mas-info-tablas-main").append("<a href='#' class='ui-btn ui-icon-arrow-l ui-btn-icon-left' data-rel='back' data-transition='slide'>Volver</a>");
	            $("#page-mas-info-tablas-titulo").html("Mas Info - Buscar Por: " + codigo_a_buscar);
	            $.mobile.changePage( "#page-mas-info-tablas", { transition: "slideup", changeHash: true });
	            $("#page-mas-info-tablas-main").trigger('create');


			}
    	}
    	ejecutar_ajax_ws(url, params, "mas info", _procesar_mas_info);
    }    
    //alert("codigo_a_buscar:"+codigo_a_buscar);
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
			$("#estado").html("LatikaIT");
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
	
	var nueva_consulta = "<li><a href='#page-"+consulta.nombreTabla+"-"+consulta.codigo+"'  data-transition='slide'>"+consulta.nombreAMostrar+"</a></li>";
	$("#main-ul-consultas-disponibles").append(nueva_consulta);
}




//consulta.prop: {codigo, nombreTabla, nombreAMostrar, filtro[]{.nombre, tipo, filtro}, orden, ordenBy}
function consulta_agregar_page(consulta){
	//alert("pag OKe");
	var page = "";
	//var template = "<h1>{{firstName}} {{lastName}}</h1>Blog: {{blogURL}}";
	//var html = Mustache.to_html(template, person);
	//$('#sampleArea').html(html);
	var id = consulta_get_id_html(consulta);

	//page = $("body").append($("<div>").append($("<div>").append($("<h1>tiulo</h1>"))).append($("<div>contenttt</div>"))	);​
	var page = "														\
	<div data-role='page' id='"+id+"'>     \
		<div data-role='header' data-position='fixed' >                    \
			<a href='#' class='ui-btn ui-icon-arrow-l ui-btn-icon-left ui-btn-icon-notext' data-rel='back' data-transition='slide'>Volver</a>   \
			<h1>"+consulta.nombreAMostrar+"</h1>	";
			//<button id='actualizar' class='ui-btn ui-icon-delete ui-btn-icon-left ui-btn-icon-notext' >Actualizar</button>		\
	page = page + "\
		</div>		\
			<div data-role='main' class='ui-content'>		";
				
	

	//alert("len filter" + consulta.filtro.length);
	if(consulta.filtro.length>0){
		page = page + "\
			<div data-role='collapsible' class='filtros-colapsable'>		\
				<h1>Filtros</h1>";
		$.each(consulta.filtro, function(index, filtro){
			//alert("filtrooooo: "+filtro.filtrar);
			if(filtro.filtrar){
				var id_filtro = id + "-filtro-campo" + filtro.nombre.replace(" ", "");
				page =page+"\
				<div class='ui-field-contain filtro-para-seleccion' >		\
					<label for='"+id_filtro+"'>"+filtro.nombre+"</label>	\
					<input type='text' id='"+id_filtro+"' campo='"+filtro.nombre+"' tipo='"+filtro.tipo+"' condicion='"+filtro.condicion+"' data-type='search' placeholder='"+filtro.nombre+" ...'>	\
				</div>";
			}
		});
		page = page + "</div>";
	}


	var id_btn_buscar = id+"-filtro-buscar";
	var id_tabla = consulta_get_id_tabla_html(consulta);
	
	//alert("okok");
	page = page + "\
		<button class='ui-btn ui-icon-search ui-btn-icon-left boton-buscar-datos' codigo='"+consulta.codigo+"' id='"+id_btn_buscar+"'>Buscar</button>		\
				<table  id='"+id_tabla+"' data-role='table' class='ui-responsive ui-shadow agregar_ver_notas' >		\
					<thead>		\
					<tr>		";
	//alert("OKOKOKOKKOKO");

	//cargo las columnas
	$.each(consulta.filtro, function(index, columna){
		if(consulta.columnaCodigo.toLowerCase() == columna.nombre.toLowerCase()){
			//alert("encontro el codigo:"+columna.nombre);
			page = page + "<th class='ver_notas_codigo' >"+columna.nombre+"</th>";
		}
		else{
			page = page + "<th>"+columna.nombre+"</th>";
		}
	});

	if(consulta.desgloseTipo!="")
		page = page + "<th>"+COL_TH_MAS_INFO+"</th>";

	page = page + "\
					</tr>		\
					</thead>	\
					<tbody>		\
					</tbody>	\
				</table>		\
			</div>		\
			<div data-role='footer'  class='centrado' data-position='fixed'  >		\
				LatikaIT		\
			</div>		\
		</div>";

	//alert(page);
	//$("body").addClass("asdfadfasdfasd");
	$("body").append(page);

}
function obtener_consultas(){

	function _proceso_agregar_consultas(resultado){
		//alert("proceasndoooo" + tabla);

		_consultas = resultado;

		if(_consultas.length>0){
			for (var i = 0; i < _consultas.length; i++) {
				//alert("varr " + i);
				var consulta = _consultas[i];

				consulta_agregar_en_menu(consulta);
				consulta_agregar_page(consulta);

				//for(var key in rowData) alert('----key: ' + key + '\n' + '----value: ' + rowData[key]);
				
				//alert( rowData);
			}
		}

		
		//alert("FIn proceasndoooooo ");
	}
	var url = _url + WS_OBTENERCONSULTAS;
	//alert("url:OBETNERCONSULTASS:"+url);
	//alert("antes ajax");
	ejecutar_ajax_ws(url, _params, "Cargando consultas", _proceso_agregar_consultas);
	//alert("despues ajax");




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

	$(".boton-buscar-datos").click(function(){

		var consulta_codigo = $(this).attr("codigo");
		//alert(consulta_codigo);

		//alert("lenn"+_consultas.length);

		$.grep(_consultas, function(consulta, index){
			//BUSCO LA CONSULTA
			//alert("compare: " + consulta.codigo + "__" + consulta_codigo);
			if(consulta.codigo != consulta_codigo)
				return;

			//Si llego hasta aca es que es la consulta seleccionada
			//alert(consulta.codigo);
			//alert(consulta.nombreTabla);
			
			var id = "#" +  consulta_get_id_html(consulta);
			//alert(id);

			var where = "";			
			$(id + " .filtro-para-seleccion input").each(function(){
				//alert($(this).val());
				//alert("attr-"+$(this).attr("campo"));

				var valor = $(this).val();
				var campo = $(this).attr("campo");
				var tipo = $(this).attr("tipo");
				var condicion = $(this).attr("condicion");
				//alert("condicion:"+condicion);

				where = where + sql_query_agregar_condicion_si_corresponde(campo, tipo, condicion, valor);
				//alert("where::::::"+where);
			});

			if (where != ""){				
				where = where + " 1 = 1 ";			
				//alert("where:"+where);
				var newparams = _params;
				var url = _url + WS_OBTENERTABLA;
				newparams = newparams.replace('}', ", tabla:'"+consulta.nombreTabla+"'}");
				newparams = newparams.replace('}', ", filtro:\"" + where+ "\"}");
				newparams = newparams.replace('}', ", orden:'"+consulta.orderBy+"'}");
				//alert("newparams:"+newparams);
				//$("#page-actores1-7-filtro-campoCodigoActor").val(newparams);

				var id_tabla = consulta_get_id_tabla_html(consulta);
				//alert("consulta_get_id_tabla_html:"+id_tabla);

				ajax_cargar(url, newparams, consulta.nombreAMostrar +"!", id_tabla, consulta);
				$("#"+id_tabla).table("refresh");
				//alert("TERMINADOOOO");
			}//fin if where
			else{
				if(consulta.filtro.length>0)
					alert("Debe ingresar al menos un filtro. ");
			}

		});

	});

});
