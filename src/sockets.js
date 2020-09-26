const Chat = require('./models/Chat'); // Se importa el Schema

module.exports = function(io){ //Función que es exportada

    let users = { // Se declara objeto para almacenar usuarios. Esto simula almacenamiento en una BBDD.
        "Azfe" : {
        }
    };         
    
    io.on('connection', async socket => {
        console.log('new user connected');

        let messages = await Chat.find({});
        socket.emit('carga los mensajes antiguos', messages);

        socket.on('new user', (data, cb) => { // Se escucha evento desde el cliente. Recibe datos y callback por parámetros
            
            //console.log(data);

            if(data in users) { // Si existe devuelve el indice de la pos. en array. Si no, devuelve -1
                cb(false);
            }else{
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                //users.push(socket.nickname) // Se envía el nick del usuario
                updateNicknames();
            }
        });

        socket.on('send message', async(data, cb) => { // Se envia el mensaje introducido al servidor | async para que funcione de forma asincrona
            // "/w Azfe adsafdsgs"
            var msg = data.trim(); // método trim() se encarga de eliminar los espacios de más de los textos

            if(msg.substr(0,3) === '/w '){
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if(index !== -1){
                    var name = msg.substring(0, index);
                    var msg = msg.substring(index + 1);
                    if(name in users){
                        users[name].emit('whisper', { // Se emite evento de socket llamado whisper al usuario indicado. (Envío de mensaje privado)
                            msg: msg,
                            nick: socket.nickname,
                        });
                    }else{ // En el caso de que el usuario receptor del msg no se encuentre conectado
                        cb('Error! Por favor, introduce un usuario conectado');
                    }
                }else{
                        cb('Error! Por favor, ingrese su mensaje');
                }
            }else{

                var newMsg = new Chat({ // Schema
                    msg: msg,
                    nick: socket.nickname
                });
                await newMsg.save();

                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                });
            }
        });

        socket.on('disconnect', data =>{
            if(!socket.nickname) return;
            delete users[socket.nickname]; // Desde el objeto users se elimina aquel que tenga el nickname del socket que se está desconectando.
            //nicknames.splice(nicknames.indexOf(socket.nickname), 1) // método splice permite quitar un solo elemento indicándolo en el indice
            io.sockets.emit('usernames', nicknames);
            updateNicknames();
        });

        function updateNicknames(){
            io.sockets.emit('usernames', Object.keys(users)); // Envía todos los usuarios almacenados en el array
        }
    });
}