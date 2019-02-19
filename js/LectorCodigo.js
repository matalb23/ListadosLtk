var app = {
    // Application Constructor
    initialize: function() {

        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('encode').addEventListener('click', this.encode, false);

    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {

        app.receivedEvent('deviceready');

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    scan: function() {
        console.log('scanning');

        var scanner = cordova.plugins.barcodeScanner;

        scanner.scan(

		function (result) {
			if(!isNaN(result.text)  )
			{
        if (result.text!="")
				{
        //  Firmar(result.text);
        }
			}
      else {
          alert("No es un qr valido");
      }
			window.location = "inspeccionar.html";
      },
      function (error) {
          alert("No se leyo el interno: " + error);
      },
      {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : false, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          saveHistory: false, // Android, save scan history (default false)
          prompt : "Firme el Interno", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }

		);
    },

    encode: function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {

            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );

    }

};
