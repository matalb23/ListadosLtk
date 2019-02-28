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
				$("#main-ul-consultas-disponibles").append("<li data-role='list-divider' class='contenedor-titulos-separadores'><h1 class='titulos-separadores'>Links</h1></li>");

				for (var i = 0; i < resultado.length; i++) {

					var link = resultado[i];
					//alert("link:"+link);
					//	alert(link);
					link_agregar_en_menu(link);
					//for(var key in rowData) alert('----key: ' + key + '\n' + '----value: ' + rowData[key]);
					//alert( rowData);

				}
			}
		}
		ejecutar_ajax_ws(url, _params, "Cargando Links", _proceso_agregar_link);
	}
	function link_agregar_en_menu(link){
		var nuevo_link;
		//nuevo_link = "<li> <a href='#' onclick='window.open('"+link.url+"', '_system');'>"+link.nombre+"</a> </li>";

		nuevo_link = "<li class='contenedor-link-lista'> <a class='link-lista' href='#' onclick=\"window.open('"+link.url+"', '_system');\">"+link.nombre+"</a> </li>";
	//nuevo_link = "<li>   <a onclick="navigator.app.loadUrl('"+link.url+"', { openExternal:true });">Link</a></li>";
		//alert(nuevo_link);
		$("#main-ul-consultas-disponibles").append(nuevo_link);
	}
function ws_leer_url(){
	var url =acceso_ws_get_url();
	//alert("leido " + url);
	$("#url_ws").val(url);
};
function Ir_Conexiones(){
      window.location.href="conexiones.html";
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

		}else{


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

			for (var i = 0; i < data.length; i++) {
				var rowData = data[i];
				//alert("rowData: " + rowData);
				var row = $("<tr/>");
				var col;
				if(primera_vez){
					//row.append($("<td class='primera'>  </td>"));
					$("#"+id_tabla).append("<tr class='primera'><td class='blank-space'></td></tr>");
					primera_vez = false;
				}

				for(var columna in columnas){
					/*
					 * esto es porque cuando lee las descripciones estan separadas por espacios y en el vector tienen que tener el nombre exacto
					 * Ej: Fecha Inicio => vector[Fecha Inicio] y deberia ser Fecha Inicio  => vector[fechainicio]
					 */
					col = columnas[columna].replace(/\s+/g, '').toLowerCase();

					row.append($(row_datos_nueva(rowData[col])));


				}//fin for

				if(consulta.desgloseTipo!=""){
						//agrego la columna para hacer click
						//row.append($( "<td class='row-dato'>" + dato + "</td>";));
						var ver_click = "<div onclick=\"mas_info("+consulta.codigo+", '"+consulta.desgloseTipo+"', '"+rowData[col_codigo]+"', '"+consulta.desgloseColumnaUnica+"', '"+consulta.columnaCodigo+"')\" class='btn_ver_notas btn btn-secondary'> Más Información </div>";
						//alert("ver_click:"+ver_click);
						row.append($("<td class='row-dato'>" + ver_click+ "</td><td class='blank-space'></td>"));
					}

				$("#"+id_tabla).append(row);
			}
			if(!primera_vez){//si es falso, tiene datos, agrego la ultima fila
				$("#"+id_tabla).append("<tr class='ultimo'></tr>");
			}

			$("#estado").html("Latika Developer Team");

		}


    });
    ajax.fail(function (xhr, status) {
		$("#estado").html( nombre + " ERROR");
        alert("faillll-" + status + " - Url: " + url + " - params: " + params);
		if(xhr!=null)
			alert("xhr.responseText:"+xhr.responseText);
    });
    ajax.always(function () {

    });

};

function mas_info(consulta_codigo, tipo, codigo_a_buscar, columna_unica, columna_codigo){

    var url;
    var params;
    if(tipo!=''){

    	url = _url + WS_MASINFO_SIMPLE;
    	params = "{acceso:'"+acceso_ws_get_clave() + "', consulta_codigo:"+consulta_codigo+", codigo_a_buscar:'"+codigo_a_buscar+"', ConexionId:'"+ getConfigValue("conexion")+"'}";
    	//params = _params;
    	function _procesar_mas_info(resultado){

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
			//	alert("resultado:"+resultado);
				var primera =1;
				for (var i = 0; i < resultado.length; i++) {
								primera =1;
									html = "<div class='card'>";
									for(var key in resultado[i]) {

							// html+= "<div class='ui-field-contain'>";
							if(primera==1)//if(key.toLowerCase() == columna_codigo.toLowerCase() )
							{
							// html+= "<span ><strong>"+key+": </strong></span>";
								html+= "<div class='card-header'>";
								html+= "<strong>"+key+":</strong> "+resultado[i][key];
								html+= "</div>";
								html+= "<div class='card-body'>";
								html+= "<ul class='list-group list-group-flush'>";
								primera=0;

					 }
							else{

								// html+= "<span >"+key+": </span>";
								html+= "<li class='list-group-item'><strong>"+key+":</strong>"+resultado[i][key]+"</li>";
							}
							html+= "</ul>";

							// html+= "<span><strong>"+resultado[i][key]+"</strong></span>";
					//    html+= "</div>";
					}
						html+= "</div>";
					//html += "<hr noshade/>";
					html += "</div>";
					//alert(html);
					$("#page-mas-info-tablas-main").append(html);
							}
							$("#page-mas-info-tablas-main").append(Cabezal());
	            // $("#page-mas-info-tablas-main").append("<a href='#' class='ui-btn ui-icon-arrow-l ui-btn-icon-left' data-rel='back' data-transition='slide'>Volver</a>");
	            // $("#page-mas-info-tablas-titulo").html("Mas Info - Buscar Por: " + codigo_a_buscar);
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

	var nueva_consulta = "<li class='contenedor-link-lista'><a class='link-lista' href='#page-"+consulta.nombreTabla+"-"+consulta.codigo+"'  data-transition='slide'>"+consulta.nombreAMostrar+"</a></li>";
	$("#main-ul-consultas-disponibles").append(nueva_consulta);
}




//consulta.prop: {codigo, nombreTabla, nombreAMostrar, filtro[]{.nombre, tipo, filtro}, orden, ordenBy}
function consulta_agregar_page(consulta){

	var page = "";

	var id = consulta_get_id_html(consulta);

	var page = "														\
	<div data-role='page' id='"+id+"'>     \
	<div id=''>     \
		<div id='navbar7'>     \
			<nav class='navbar navbar-toggleable-md navbar-light bg-faded fixed-top invers-fixed'>     \
				<div class='container' style=' margin: 0px; text-align: center;width: 100%'>     \
					<div class='collapse navbar-collapse justify-content-start' id='navbarSupportedContent' style='position: absolute; left: 0px;'>     \
						<ul class='navbar-nav'>     \
							<li class='nav-item'>     \
								<button onclick='goBack()' class='nav-link' style='border: 0px;/* padding-left: 20px; */background-image: url(dist/images/ico-back-52.png);background-repeat: no-repeat;background-position: center;background-color: #0d1b34;background-position-x: 97%;'></button>     \
							</li>     \
						</ul>     \
					</div>     \
					<a class='navbar-brand justify-content-center' href='#'>     \
						<img src='dist/images/logo-consultas-b.png' width='163px' height='37px' style='position: relative; top: -9px;'/>     \
					</a>     \
				</div>     \
			</nav>    \
		</div> ";


	page = page + "\
		</div>		\
		<div data-role='main' class='ui-content' style='position: relative; margin-top: 80px;'>      \
				<ul data-role='listview' id='main-ul-consultas-disponibles'>     \
					<li data-role='list-divider' style='border-bottom:2px solid #bdbdbd; background: #ffffff; min-height: 60px; padding: 30px 20px 0px 20px;'>     \
						<h1 style='color:#009ee3; font-size: 14px; letter-spacing: 1px; font-weight: 400; text-transform: uppercase;'>"+consulta.nombreAMostrar+"</h1>     \
					</li>     \
				</ul>     \
		</div>      \
			<div data-role='main' class='ui-content'>		";


	if(consulta.filtro.length>0){
		page = page + "\
			<div data-role='collapsible' class='filtros-colapsable '>		\
				<h1>Filtros</h1>";


		$.each(consulta.filtro, function(index, filtro){

			if(filtro.filtrar){
				var id_filtro = id + "-filtro-campo" + filtro.nombre.replace(" ", "");


			page =page+"\
			<div class='ui-field-contain filtro-para-seleccion' >		\
				<label for='label_"+id_filtro+"' id='L_"+id_filtro+"' onclick='leerBarcode(this.id)'>"+filtro.nombre+"</label>		\
				<input type='text' id='"+id_filtro+"' campo='"+filtro.nombre+"' tipo='"+filtro.tipo+"' condicion='"+filtro.condicion+"' data-type='search' placeholder='"+filtro.nombre+" ...'>	\
			</div>";

			}
		});
		page = page + "</div>";
	}


	var id_btn_buscar = id+"-filtro-buscar";
	var id_tabla = consulta_get_id_tabla_html(consulta);

	page = page + "<button class='btn btn-primary btn-sh-primary boton-buscar-datos' codigo='"+consulta.codigo+"' id='"+id_btn_buscar+"'>Buscar</button>";
	page = page + "<table  id='"+id_tabla+"' data-role='table' class='ui-responsive ui-shadow agregar_ver_notas' >";
	page = page + "	<thead>";
	page = page + "<tr>		";
	//cargo las columnas
	$.each(consulta.filtro, function(index, columna){
		if(consulta.columnaCodigo.toLowerCase() == columna.nombre.toLowerCase()){
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
		  	<div class='row' style='background-color: #0d1b34;padding: 5px;text-align: center;line-height: 13px;position: fixed;bottom: 0px;width: 110%;'>		\
		  		<div class='col-lg-12'>		\
		              <div class='copy'>		\
		                  <p style='margin-bottom: 0px;'><img src='dist/images/logo-ltk.png' width='63px' height='10px'/></p>		\
		              </div>		\
		          </div>		\
		  	</div>		\
		</div>";

	$("body").append(page);

}
function leerBarcode(id)
{

	id=id.substring(2, id.length);
//alert(id);
//document.getElementById('test').setAttribute('id', 'nextstep');

var scanner = cordova.plugins.barcodeScanner;
//alert(this.id);
//alert($(this).attr('id').substring(1));

scanner.scan(

function (result) {

if (result.text!="")
{
	 //
	// alert($(this).attr('id').substring(1));
	 document.getElementById(id).setAttribute('value', result.text);

}

//window.location = "inspeccionar.html";
},
function (error) {
	alert("No se leyo el codigo de barras: " + error);
},
{
	preferFrontCamera : false, // iOS and Android
	showFlipCameraButton : false, // iOS and Android
	showTorchButton : true, // iOS and Android
	torchOn: true, // Android, launch with the torch switched on (if available)
	saveHistory: false, // Android, save scan history (default false)
	prompt : "leer codigo", // Android
	resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
	formats :"QR_CODE",// "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
	orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
	disableAnimations : true, // iOS
	disableSuccessBeep: false // iOS and Android
}

);


$(".boton-buscar-datos").trigger("click");
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
	//alert(_params);
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
function Cabezal()
{
var html;
html=""
	html+=" <!-- start hero base cabezal -->";
  html+=" <div id=''>";
	html+=" <!-- start CABEZAL -->";
	html+=" <div id='navbar7'>";
		html+=" <nav class='navbar navbar-toggleable-md navbar-light bg-faded fixed-top invers-fixed'>";
			html+=" <div class='container' style=' margin: 0px; text-align: center;width: 100%'>";

				html+=" <!-- start MENU -->";
				html+=" <div class='collapse navbar-collapse justify-content-start' id='navbarSupportedContent' style='position: absolute; left: 0px;'>";
					html+=" <ul class='navbar-nav'>";
						html+=" <li class='nav-item'>";
							html+=" <button onclick='goBack()' class='nav-link' style='border: 0px;/* padding-left: 20px; */background-image: url(dist/images/ico-back-52.png);background-repeat: no-repeat;background-position: center;background-color: #f0f8ff00;background-position-x: 97%;'></button>";
						html+=" </li>";
					html+=" </ul>";
				html+=" </div>";
				html+=" <!-- end MENU -->";
				html+=" <!-- start LOGO -->";
				html+=" <a class='navbar-brand justify-content-center' href='#'>";
					html+=" <img src='dist/images/logo-consultas-b.png' width='163px' height='37px' style='position: relative; top: -9px;'/>";
				html+=" </a>";
				html+=" <!-- end LOGO -->";




			html+=" </div>";
		html+=" </nav>";
	html+=" </div>";
html+=" <!-- end CABEZAL -->";
html+=" </div>";
html+=" <!-- end hero base cabezal-->";
return html;

}

$(document).ready(function(){
	//alert("ready-indexok.js");
	_clave = acceso_ws_get_clave();
	_params = "{acceso: '"+_clave+"' ,ConexionId:'"+ getConfigValue("conexion")+"'}";
	_url = acceso_ws_get_url();
	//alert("_url:"+_url);
	_consultas = [];

	actualizar();
	$(".boton-lector").click(function(){
			var scanner = cordova.plugins.barcodeScanner;
//alert(this.id);
 //alert($(this).attr('id').substring(1));

			scanner.scan(

	function (result) {
		if(!isNaN(result.text)  )
		{
			if (result.text!="")
			{
				 //$(".boton-buscar-datos").trigger("click");
				 alert($(this).attr('id').substring(1));
			}
		}
		else {
				alert("No es un codigo valido");
		}
		//window.location = "inspeccionar.html";
		},
		function (error) {
				alert("No se leyo el codigo de barras: " + error);
		},
		{
				preferFrontCamera : false, // iOS and Android
				showFlipCameraButton : false, // iOS and Android
				showTorchButton : true, // iOS and Android
				torchOn: true, // Android, launch with the torch switched on (if available)
				saveHistory: false, // Android, save scan history (default false)
				prompt : "leer codigo", // Android
				resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
				formats :"QR_CODE",// "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
				orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
				disableAnimations : true, // iOS
				disableSuccessBeep: false // iOS and Android
		}

	);

		});

	$(".boton-buscar-datos").click(function(){

		var consulta_codigo = $(this).attr("codigo");


		$.grep(_consultas, function(consulta, index){

			if(consulta.codigo != consulta_codigo)
				return;


			var id = "#" +  consulta_get_id_html(consulta);
			//alert(id);

			var where = "";
			$(id + " .filtro-para-seleccion input").each(function(){

				var valor = $(this).val();
				var campo = $(this).attr("campo");
				var tipo = $(this).attr("tipo");
				var condicion = $(this).attr("condicion");
				where = where + sql_query_agregar_condicion_si_corresponde(campo, tipo, condicion, valor);

			});


				where = where + " 1 = 1 ";
				var newparams = _params;
				var url = _url + WS_OBTENERTABLAV2;
				newparams = newparams.replace('}', ", IdConsulta:'"+consulta_codigo+"'}");
				newparams = newparams.replace('}', ", tabla:'"+consulta.nombreTabla+"'}");
				newparams = newparams.replace('}', ", filtro:\"" + where+ "\"}");
				newparams = newparams.replace('}', ", orden:'"+consulta.orderBy+"'}");

				var id_tabla = consulta_get_id_tabla_html(consulta);

				ajax_cargar(url, newparams, consulta.nombreAMostrar +"!", id_tabla, consulta);
				$("#"+id_tabla).table("refresh");



		});

	});

});
