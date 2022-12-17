var Models = {};
var Collections = {};
var notifier = new Notifier();
var genericModal = new bootstrap.Modal(document.getElementById('modalGenerico'), {keyboard: false});
var modalFormCompras = new bootstrap.Modal(document.getElementById('modalFormCompras'), { keyboard: false});
var modalFormGastos = new bootstrap.Modal(document.getElementById('modalFormGastos'), { keyboard: false});

Models.Usuario = Backbone.Model.extend({
    initialize: () => {
        console.log("inicializa el modelo de registro")
    },
    defaults: {
        tipoIdentificacion: 0,
        documento: 0,
        email: '',
        usuario: '',
        clave:'',
        terminos_condiciones: false,
        saldo: 0
    }
})

const Dash = () => {

    var $scope = {};

    let getTokenHeader = function(){
        let instance = axios.create({
            baseURL: 'http://127.0.0.1:8090/master-financer/api/'
        });
        let token = sessionStorage.getItem('token');
        if(!token) return null;
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return instance;
    }

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

    let listarCompras = function()
    {
        let _axios = getTokenHeader();
        return _axios.get('http://127.0.0.1:8090/master-financer/api/compras/todo')
        .then(function (response) {
            if(response.status == 200){
                console.log(response.data);
                preparaListaCompras(response.data);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    let listarGastos = function()
    {
        let _axios = getTokenHeader();
        return _axios.get('http://127.0.0.1:8090/master-financer/api/gastos/listar')
        .then(function (response) {
            if(response.status == 200){
                console.log(response.data);
                preparaListaGastos(response.data);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    let preparaListaCompras = function(compras){
        let html = '<ul class="list-group list-group-flush">';
        _.each(compras, function(compra){
            html+=`<li class="list-group-item">Fecha inicial: ${compra.fechaInicial}<br/>`;
            html+=`Valor: ${compra.valorCompra}<br/>`;
            html+=`Tipo pago: ${compra.tipoPago}<br/>`;
            html+=`Saldo pendiente: ${compra.saldoPendiente}<br/>`;
            html+=`Estado credito: ${compra.estadoCredito}<br/>`;
            html+='</li>';
        });
        html+="</ul>";
        $('#showContentModal').html(html);
    }

    let preparaListaGastos = function(gastos){
        let html = '<ul class="list-group list-group-flush">';
        _.each(gastos, function(gasto){
            // html+=`<li class="list-group-item">Fecha inicial: ${gasto.fechaInicial}<br/>`;
            html+='</li>';
        });
        html+="</ul>";
        $('#showContentModal').html(html);
    }

    let formPreparaCompra = function(){
        modalFormCompras.show();
    }

    let formPreparaGastos = function(){
        modalFormGastos.show();
    }

	let previusEvent = function(){
        buscarDatosUsuario();
        $("#nuevaCompra").click(function(event){
            event.preventDefault();
            formPreparaCompra();
        });

        $("#listaCompras").click(function(event){
            event.preventDefault();
            $('#showContentModal').html("<p style='font-size:1rem' class='text-center'>Procesando consulta de compras</p>"); 
            listarCompras().then(function(){
                genericModal.show();                   
            });
        });

        $("#nuevoGasto").click(function(event){
            event.preventDefault(); 
            formPreparaGastos();
        });

        $("#listaGastos").click(function(event){
            event.preventDefault();
            $('#showContentModal').html("<p style='font-size:1rem' class='text-center'>Procesando consulta de gastos</p>"); 
            listarGastos().then(function(){
                genericModal.show();                   
            });
        });
	}

    let postEvent = function(){
        
	}

    let buscarDatosUsuario = function(){
        let usuario = sessionStorage.getItem('usuario');
        let _axios = getTokenHeader();
        _axios.get('http://127.0.0.1:8090/master-financer/api/user/buscar?username='+usuario)
        .then(function (response) {
            if(response.status == 200){
                console.log(response.data);
                preparaDataUsuario(response.data);
            }
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
        });
    };

    let preparaDataUsuario = function(user){
        if (user == void 0) return void 0; 
        $scope.usuario = new Models.Usuario(user);
        $('#showSaldoDisponible').text('$ '+$scope.usuario.get('saldo'));
        let html = "";
        html+= "Nombre: "+$scope.usuario.get('nombres') +' '+$scope.usuario.get('apellidos')+'<br/>';
        html+= "Identificación: "+$scope.usuario.get('id')+'<br/>';
        html+= "Usuario: "+$scope.usuario.get('username')+'<br/>';
        $('#dataUserSesion').html(html);
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
    Dash().init()
});
