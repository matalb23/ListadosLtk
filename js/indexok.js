//para que no tarde el click
window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);


function validar_url_clave(url,usuario, clave){
  url = acceso_ws_get_url();
	var url_validar = url + WS_VALIDAR;
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

		}
	    });
	    ajax.done(function (response) {

			var resultado_json = $.parseJSON(response.d);


			if(resultado_json.codigo !=100){//100 es ok

				alert( resultado_json.descripcion);

					acceso_ws_set_logueado("N");
					window.location.href="login.html";
			}else{
				setConfigValue("usuario",usuario);
				setConfigValue("clave",clave);
				acceso_ws_set_clave(resultado_json.resultado);//acceso
				acceso_ws_set_logueado("S");
				window.location.href="conexiones.html";
			}


	    });
	    ajax.fail(function (xhr, status) {

	        alert("fail-" + status + " - url: " + url_validar + " -  " + params);
	    });
	    ajax.always(function () {

    });
};

function validar_si_ya_existe_clave(){
var url = acceso_ws_get_url();

var usuario  =getConfigValue("usuario");
var clave =   getConfigValue("clave");

	if(url !=null && clave!=null && usuario!=null )
		if (url!="" && clave!="" && clave!="")
			validar_url_clave(url, usuario,clave);
};

function validar(){
	var clave  = $("#clave").val();
	var usuario  = $("#usuario").val();

	setConfigValue("usuario",usuario);
	setConfigValue("clave",clave);

	var url = acceso_ws_get_url();
	validar_url_clave(url, usuario,clave);

	////////////////////////////////////////////////////////////////////////////////////
};



$(document).ready(function(){
	validar_si_ya_existe_clave();

});
