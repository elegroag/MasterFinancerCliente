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

Models.Compra = Backbone.Model.extend({
    initialize: () => {
        console.log("inicializa el modelo de compra")
    },
    urlRoot: 'http://localhost:8090/master-financer/api/compras/registrarCompraFull',
    defaults: {
        fechaInicial: '',
        fechaFinal:'',
        estadoCredito:'',
        tipoPago:'',
        persona:'',
        saldoPendiente: 0,
        valorCompra:0,
        usuario:0
    },
    validate: (attrs, options) => {
        let errors = []
        if (attrs.fechaInicial == '') {
            errors.push({"key":"fechaInicial","value":"el fecha inicial es valor requerido"})
        }
        if (attrs.estadoCredito == 0) {
            errors.push({"key":"estadoCredito", "value":"el estado credito es valor requerido"})
        }
        if (attrs.tipoPago == '') {
            errors.push({"key":"tipoPago","value":"el tipo pago es valor requerido"})
        }
        if (attrs.persona == 0) {
            errors.push({"key":"persona", "value":"el persona es valor requerido"})
        }
        if (attrs.saldoPendiente == '') {
            errors.push({"key":"saldoPendiente", "value":"la saldo pendiente es valor requerido"})
        }
        return (_.size(errors) > 0)? errors : void 0;
    }
})

Models.Gasto = Backbone.Model.extend({
    initialize: () => {
        console.log("inicializa el modelo de compra")
    },
    urlRoot: 'http://localhost:8090/master-financer/api/gastos/createGastoFull',
    defaults: {
        "medioPago":"",
        "gastoCategoria": 0,
        "fecha": "",
        "hora": "",
        "usuario": 0,
        "valor": 0,
        "estado": "",
        "tipoTransaccion": "",
        "transaccion": ""
    },
    validate: (attrs, options) => {
        let errors = []
        if (attrs.medioPago == '') {
            errors.push({"key":"medioPago","value":"el medioPago es valor requerido"})
        }
        if (attrs.gastoCategoria == 0) {
            errors.push({"key":"gastoCategoria", "value":"el gasto Categoria es valor requerido"})
        }
        if (attrs.fecha == '') {
            errors.push({"key":"fecha","value":"el fecha es valor requerido"})
        }
        if (attrs.hora == 0) {
            errors.push({"key":"hora", "value":"el hora es valor requerido"})
        }
        if (attrs.usuario == 0) {
            errors.push({"key":"usuario", "value":"la usuario es valor requerido"})
        }
        if (attrs.valor == 0) {
            errors.push({"key":"valor", "value":"la valor es valor requerido"})
        }
        if (attrs.estado == '') {
            errors.push({"key":"estado", "value":"la estado es valor requerido"})
        }
        if (attrs.tipoTransaccion == 0) {
            errors.push({"key":"tipoTransaccion", "value":"la tipo transaccion es valor requerido"})
        }
        return (_.size(errors) > 0)? errors : void 0;
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
        if(_.size(gastos) == 0){
            $('#showContentModal').html("<p>No hay registros de gastos en el momento.</p>");    
            return false;
        }
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
        $('#confimaCompra').click(function(event){
            event.preventDefault();

        });

        $('#confimaGasto').click(function(event){
            event.preventDefault();

        });
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
