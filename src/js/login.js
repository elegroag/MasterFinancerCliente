var Models = {};
var Collections = {};

var notifyModal = new bootstrap.Modal(document.getElementById('modalGenerico'), {keyboard: false});
var notifier = new Notifier();

Models.Login = Backbone.Model.extend({
    initialize: () => {
        console.log("inicializa el modelo de login")
    },
    urlRoot: 'http://localhost:8090/master-financer/api/auth/authenticate',
    defaults: {
        username: '',
        password: ''
    },
    validate: (attrs, options) => {
        let errors = []
        if (attrs.username == '') {
            errors.push({"key":"username","value":"el usuario es un valor requerido"})
        }
        if (attrs.password == 0) {
            errors.push({"key":"password", "value":"la clave es un valor requerido"})
        }
        return (_.size(errors) > 0)? errors : void 0;
    }
})

const Login = () => {

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
       //notifier.notify("warning", "No hay conección de Internet para continuar con el proceso.");
	}

	let buscarUsuario = function(usuario, data){
		sessionStorage.setItem('usuario', usuario)
		sessionStorage.setItem('token', data.jwt)
	}

    let postEvent = function(){
        $('#autenticar').click(function(event){
            event.preventDefault();
            let _data = preparaToken("#form_login");
			let auth = new Models.Login(_data) 
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
                axios.post('http://127.0.0.1:8090/master-financer/api/auth/authenticate', auth.toJSON())
                .then(function (response) {
                    if(response.status == 200){
                       buscarUsuario(auth.get('username'), response.data);
                       $('#showContentModal').html("<p style='font-size:1rem' class='text-center'>La autenticación con el servidor es un éxito. Gracias y bienvendio al sistema.</p>");
                       notifyModal.show();
                       setTimeout(function(){
                            window.location.href= "./dash.html";
                        }, 3000);
                    }else{
                        notifier.notify("warning", "Respuesta de error en la solicitud realizada");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    notifier.notify("warning", "No hay acceso al servidor, no es posible establecer la comunicación");
                });
            }
            return false;
        });
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
    Login().init()
});
