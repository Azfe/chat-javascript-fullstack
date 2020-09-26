const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://Azfe:Obturador1984@clusterazfe.vetbg.mongodb.net/<dbname>?retryWrites=true&w=majority', { // Conecta a la BD de Mongodb Atlas
    useCreateIndex: true,
    useNewUrlParser: true
})
    .then(db => console.log('Db is connected'))
    .catch(err => console.error(err));