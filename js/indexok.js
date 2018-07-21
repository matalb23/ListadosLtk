//para que no tarde el click
window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);


function validar_url_clave(url, clave){
	var url_validar = url + WS_VALIDAR;
	//alert(url_validar + " ---------------------- ur-validar.");

	var params = "{acceso: '"+clave+"'}";
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
				alert("webService error cod: " + resultado_json.codigo);
				alert("webService error desc: " + resultado_json.descripcion);			
				
			}else{
				//alert("login OK");
				acceso_ws_set_clave(clave);
				acceso_ws_set_url(url);
				window.location.href="consultas.html";
			}
					
			
	    });
	    ajax.fail(function (xhr, status) {
			//$("#estado").html( nombre + " ERROR");
	        alert("fail-" + status + " - url: " + url_validar + " - clave: " + clave);
	    });
	    ajax.always(function () {
			//alert("allways");
			//$("#estado").html("OKOKOK");
    });	
};

function validar_si_ya_existe_clave(){
	//alert("estoy actualizando ok ");

	var url = acceso_ws_get_url();
	var clave = acceso_ws_get_clave();

	if(url !=null && clave!=null)
		if (url!="" && clave!="")
			validar_url_clave(url, clave);

	//alert("FINNN estoy actualizando ok ");
};

function validar(){
	var clave  = $("#clave").val();	

/*
	alert(clave + " - clave.");
	var urla = "http://www.latikait.com.ar";
	$.ajax({ url: urla, 
			async:true, 
			success: function(data) { 
				alert("success: "); alert(data); alert("Fin successs"); 
			}, 
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        alert("Status: " + textStatus); alert("Error: " + errorThrown); 
		    }, 
		    beforeSend: function(){$("#clave").val("pensando ...");}, 
		    complete: function(){ $("#clave").val("Terminado!"); }
			});
	*/


	//$.mobile.changePage( "#page-principal", { transition: "slideup", changeHash: true });
	////////////////////////////////////////////////////////////
	//var url = "http://10.0.0.80:6002/serviciows.asmx/ValidarClave";
	var url = $("#url_ws").val();
	//alert(url + " - url.");
	validar_url_clave(url, clave);
	
	////////////////////////////////////////////////////////////////////////////////////
};



$(document).ready(function(){
	//alert("ready validarok.js");
	validar_si_ya_existe_clave();

});
