$(function(){
    
    const socket = io();

    // Obteniendo los elementos del DOM desde la interfaz:
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // Obteniendo los elementos del DOM desde el formulario de nickUsuario:
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickName = $('#nickName');

    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault(); // Evita el refresco de la información
        socket.emit('new user', $nickName.val(), data =>{ //Envía datos del nick indicado en el campo al servidor. La función flecha "data =>" se encarga de verificar si la respuesta es correcta
            if(data){ // Se validan los datos que recibe del servidor
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else{
                $nickError.html(`
                    <div class="alert alert-danger">
                        Este usuario ya existe.
                    </div>
                `);
            }
            $nickname.val('');
        }); 
        console.log('enviando...');
    });

    // Capturar eventos:
    $messageForm.submit( e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        });
        console.log($messageBox.val());
        $messageBox.val('');
        console.log('enviando datos');
    });

    socket.on('new message', function(data){ // Escuchar el evento que viene desde el servidor
        $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>'); // Se imprime mensaje junto con el nick del usuario
    });

    socket.on('usernames', data =>{ // Escucha evento (nicks) que viene del servidor
        let html = '';
        for(let i = 0; i < data.length; i++){ // Se recorre array de nicks de usuarios
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`
        }
        $users.html(html); // Se muestra información por pantalla
    });

    socket.on('whisper', data =>{
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`);
    });

    socket.on('load old msgs', msgs => {
        for (let i = 0; i < data.length; i++){
            displayMsg(msgs[i]);
        }
    })

    function displayMsg(data){
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`);
    }
})