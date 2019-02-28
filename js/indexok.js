//para que no tarde el click
window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);


function validar_url_clave(url,usuario, clave){
	var url_validar = url + WS_VALIDAR;
	//alert(url_validar + " ---------------------- ur-validar.");
	acceso_ws_set_logueado("N");
	var params = "{usuario: '"+usuario+"',clave: '"+clave+"'}";
	var ajax = $.ajax({
		url: url_validar,
		data: params,
		type: 'POST',
		contentType: "application/json; charset=utf-8",
		async: false,
		dataType: 'json',
		beforeSend: function () {
			//$("#estado").html("Actualizando "+ nombre +" ...");
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
				//alert("webService error cod: " + resultado_json.codigo + "webService error desc: " + resultado_json.descripcion);
				alert( resultado_json.descripcion);
				//alert(params);
					acceso_ws_set_logueado("N");

			}else{
				//alert("login OK");
				setConfigValue("usuario",usuario);
				setConfigValue("clave",clave);

				acceso_ws_set_clave(resultado_json.resultado);//acceso
				acceso_ws_set_url(url);
				acceso_ws_set_logueado("S");
				window.location.href="conexiones.html";
			}


	    });
	    ajax.fail(function (xhr, status) {
			//$("#estado").html( nombre + " ERROR");
	        alert("fail-" + status + " - url: " + url_validar + " -  " + params);
	    });
	    ajax.always(function () {
			//alert("allways");
			//$("#estado").html("OKOKOK");
    });
};

function validar_si_ya_existe_clave(){


var url = acceso_ws_get_url();
//var clave =  $("#clave").val();;
//var usuario  = $("#usuario").val();

var usuario  =getConfigValue("usuario");
var clave =   getConfigValue("clave");

	if(url !=null && clave!=null && usuario!=null )
		if (url!="" && clave!="" && clave!="")
			validar_url_clave(url, usuario,clave);


};

function validar(){
	var clave  = $("#clave").val();
	var usuario  = $("#usuario").val();

	//alert("login OK");
	setConfigValue("usuario",usuario);
	setConfigValue("clave",clave);

	var url = $("#url_ws").val();
	//alert(url + " - url.");
	validar_url_clave(url, usuario,clave);

	////////////////////////////////////////////////////////////////////////////////////
};



$(document).ready(function(){
	//alert("ready validarok.js");
	validar_si_ya_existe_clave();

});
