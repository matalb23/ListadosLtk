var STORAGE_KEY_URL = "STORAGE_KEY_URL";
var STORAGE_KEY_CLAVE = "STORAGE_KEY_CLAVE";

var WS_VALIDAR = "/consultasws.asmx/ValidarClave";
var WS_OBTENERCONSULTAS = "/consultasws.asmx/ObtenerConsultas";
var WS_OBTENERTABLA     = "/consultasws.asmx/ObtenerTabla";
var WS_MASINFO_SIMPLE   = "/consultasws.asmx/MasInfo";
var WS_OBTENERLINKS   = "/consultasws.asmx/ObtenerLinks";


function acceso_ws_get_url(){
	 return window.localStorage.getItem(STORAGE_KEY_URL);
};

function acceso_ws_set_url(url){
	var lastChar = url.substr(url.length - 1);
	if(lastChar=="/")
		url = url.substr(0, url.length - 1);

	window.localStorage.setItem(STORAGE_KEY_URL, url);
};

function acceso_ws_get_clave(){
	return window.localStorage.getItem(STORAGE_KEY_CLAVE);
};

function acceso_ws_set_clave(clave){
	window.localStorage.setItem(STORAGE_KEY_CLAVE, clave);
};
