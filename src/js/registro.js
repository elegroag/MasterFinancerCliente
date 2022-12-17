var Models = {};
var Collections = {};
var notifier = new Notifier();

Models.Auth = Backbone.Model.extend({
    initialize: () => {
        console.log("inicializa el modelo de registro")
    },
    urlRoot: 'http://localhost:8090/master-financer/api/auth/registration',
    defaults: {
        tipo_documento: 0,
        documento: 0,
        email: '',
        usuario: '',
        clave:'',
        terminos_condiciones: false
    },
    validate: (attrs, options) => {
        let errors = []
        if (attrs.usuario == '') {
            errors.push({"key":"usuario","value":"el usuario es valor requerido"})
        }
        if (attrs.documento == 0) {
            errors.push({"key":"documento", "value":"el documento es valor requerido"})
        }
        if (attrs.email == '') {
            errors.push({"key":"email","value":"el email es valor requerido"})
        }
        if (attrs.tipo_documento == 0) {
            errors.push({"key":"tipo_documento", "value":"el tipo_documento es valor requerido"})
        }
        if (attrs.clave == '') {
            errors.push({"key":"clave", "value":"la clave es valor requerido"})
        }
        return (_.size(errors) > 0)? errors : void 0;
    }
})

const Registro = () => {

	let preparaToken = function(formulario){
		let _data_array = $(formulario).serializeArray()
		let _token = {}
		let $i = 0
		while ($i < _.size(_data_array)) {
			_token[_data_array[$i].name] = _data_array[$i].value;
			$i++;
		}
		return _token;
	}

	let previusEvent = function(){
        buscarTipoDocumentos();
	}

	let buscarUsuario = function(usuario, data){
		sessionStorage.setItem('usuario', usuario)
		sessionStorage.setItem('token', data.jwt)
	}

    let postEvent = function(){
        $('#confimaRegistro').click(function(event){
            event.preventDefault();
            let _data = preparaToken("#form_registro");
			let auth = new Models.Auth(_data) 
            if (!auth.isValid()) {
                let errors = auth.validationError;
                _.each(errors, (er) => {
                    $("#"+er.key+"-error").text(er.value);
                });
                $('.error').fadeIn();
                setTimeout(function(){
                    $('.error').fadeOut();
                    $('.error').text('');
                }, 3000);
            } else {
                auth.save({}, {
                    success: function(response){
                        console.log(response);
                        buscarUsuario(auth.get('usuario'), _data)
                        setTimeout(function(){
                            window.location.href= "./dash.html";
                        }, 2000);
                    },
                    error: function(err){
                        console.log(err.responseText);
                    }
                });
            }
            return false;
        });
	}

    let buscarTipoDocumentos = function(){
        axios.get('http://127.0.0.1:8090/master-financer/api/auth/tipo_documentos')
        .then(function (response) {
            if(response.status == 200){
                console.log(response.data);
                preparaSelectTipoDocumentos(response.data);
            }
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
        });
    };

    let preparaSelectTipoDocumentos = function(collection){
        if (_.size(collection) == 0) return void 0; 
        let html = '';
        _.each(collection, function(row){
            html += `<option value='${row.id}'>${row.detalle}</option>`;
        });
        $('#tipo_documento').html(html);
    }

	let initialize = function(){
		previusEvent();
        postEvent();
	}

	return {
		"init": initialize
	}
}

const updateOnlineStatus = () => {
    if (navigator.onLine){
        notifier.notify("success", "Conexión exitosa a la red");
    } else {
        notifier.notify("warning", "No hay conección de Internet para continuar con el proceso. ");
    }
}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)
updateOnlineStatus();
$(function() {
    Registro().init()
});
