
var express = require('express');
var app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// librerias para subir documentos localmente
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const _ = require ('lodash');

app.use(fileUpload({
    createParentPath: true
}));

// librerias para subir a drive
const fs = require('fs');
const {google, admin_reports_v1} = require('googleapis');
const readline = require('readline');

// service account key file from Google Cloud console.
const KEYFILEPATH = './tee-docs-707589d7bd6d.json';
// Request full drive access.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
});


// libreria para enviar email
var nodemailer = require('nodemailer');
const emailEnvios = 'teepagweb@gmail.com';
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${emailEnvios}`, // correo
        pass: 'mjwfsbilzezrpvzh'  // app password
    }
});


var sql = require("mssql");

// var config = {
//     user: 'goku',
//     password: 'goku02',
//     server: 'localhost',
//     port : 50785, 
//     database: 'team2_test',
//     trustServerCertificate: true,
// };

//var config = {
//   user: 'team2',
//   password: 'HuevitoConPapas2023.',
//   server: 'lab420azdb01.itesm.mx',
//   port: 1433,
//   database: 'team2_prod',
//   trustServerCertificate: true,
//};

// PRUEBAS
 var config = {
   user: 'adrian',
   password: 'chavezmor',
    server: 'localhost', 
    port: 64906,
    database: 'TEEPruebas',
   trustServerCertificate: true,
 };

app.get('/', (req, res) => {
    res.send('Raiz de servicio');
});

//LOGIN
app.post('/tener_usuario', function (req, res) { //Login

    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();

        sentencia = "select ID_Usuario from USUARIO where contrasena = "+ req.body.password +" AND correo = '" + req.body.email +"'";

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err);

            if (recordset.recordset[0]){
                res.json(recordset.recordset[0])
            }
            else{
                res.json({});
            }
        });

    });
});

app.post('/crear_usuario/', (req, res) => {
    let nombre = req.body.nombre;
    let paterno = req.body.paterno;
    let materno = req.body.materno;
    let correo = req.body.correo;
    let contrasena = req.body.contrasena;
    let firel_cer = req.body.firel_cer;
    let firel_key = req.body.firel_key;

    

    sql.connect(config, function (err) {
        if (err) console.log(err);

        
        sentencia = `select count(*) from USUARIO where correo = '${correo}'`;

        
        console.log(sentencia);
        var request = new sql.Request();

        request.query(sentencia, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("error");
            };
                // if ()
                // res.send(recordset.recordset);
                console.log(recordset.recordset[0][""]);

                if (recordset.recordset[0][""] != '0') {
                    console.log("a");
                    res.send("no")
                }
                else {
                    sentencia = `insert into USUARIO 
                    (nombre, ap_paterno, ap_materno, correo, contrasena, firel_cer, firel_key) 
                    values ('${nombre}', '${paterno}', '${materno}', '${correo}', '${contrasena}', '${firel_cer}', '${firel_key}')`;

                    
                    console.log(sentencia);
                    var request = new sql.Request();

                    request.query(sentencia, function (err) {
                        if (err) {
                            console.log(err);
                            res.send("error");
                        } else {
                            console.log("si");
                        };
                    });
                }
        });


     
    });

});



//CASOS
app.get('/tener_expediente_resolucion/:usuario', function (req, res) {  //Casos con resolución

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = 'select * from EXPEDIENTE where usuario = ' + req.params.usuario + ' AND resolucion IS NOT NULL' ;

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});

app.get('/tener_expediente/:exp', function (req, res) {  //Casos con resolución

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = 'select folio from EXPEDIENTE where ID_expediente = ' + req.params.exp ;

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});

app.get('/tener_expediente_2/:exp', function (req, res) {  //Casos con resolución

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = 'select * from EXPEDIENTE where ID_expediente = ' + req.params.exp ;

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});

app.get('/tener_expediente_miembro/:exp', function (req, res) {  //Casos con resolución

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = 'select * from EXPEDIENTE where ID_expediente = ' + req.params.exp ;

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});

app.get('/tener_expediente_activos/:usuario', function (req, res) {  //Casos Activos

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = 'select * from EXPEDIENTE where usuario = ' + req.params.usuario + ' AND resolucion IS NULL' ;

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});

app.get('/expedientes/ver/:usuario', function (req, res) {  //Casos Activos

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = "SELECT * FROM EXPEDIENTE WHERE usuario = " + req.params.usuario + "AND folio is NOT NULL";

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            // console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});

app.get('/expedientes/trabaja/:miembro', function (req, res) {  //Casos Activos

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = "SELECT ID_expediente FROM TRABAJA WHERE ID_mTEE = " + req.params.miembro;

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});


app.get('/expedientes_sinfolio', function (req, res) {  //Casos Activos

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = "SELECT * FROM EXPEDIENTE WHERE folio is NULL ";

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});

app.get('/miembros_ponencia/:ponencia', function (req, res) {  //Casos Activos

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = "SELECT ID_mTEE FROM PONENCIA WHERE Ponencia = '" + req.params.ponencia + "'";

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});

app.get('/trabaja_en/:miembro/:exp', function (req, res) {  //Casos Activos

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = "INSERT into TRABAJA (ID_mTEE, ID_expediente) values ("+ req.params.miembro + ", " + req.params.exp + ")";

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});

app.get('/actualizaRepresentante/:miembro/:exp', function (req, res) {  //Casos Activos

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = "UPDATE EXPEDIENTE set representante = " + req.params.miembro + " WHERE ID_expediente = " + req.params.exp;

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});


app.get('/tener_documentos/:idusuario/:expediente', function (req, res) {  //Documentos de expediente

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = 'select * from DOCUMENTO where ID_Expediente = ' + req.params.expediente + ' and ID_Usuario = ' + req.params.idusuario;

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});



app.post('/aplicar_resolucion',function(req, res){
    let resolucion = req.body.resolucion;
    let exp = req.body.exp;

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var date = new Date().toISOString().substr(0, 10).replace('T', ' ');

        var request = new sql.Request();
        
        sentencia = `update EXPEDIENTE set resolucion = '${resolucion}', fecha_final = '${date}' where ID_expediente = ${exp} and fecha_final IS NULL and resolucion IS NULL` 

        request.query(sentencia, function (err) {
            if (err) console.log(err)
            console.log('si')
            res.send('si');
        });
    });

});


//IMPUGNAR
app.get('/nuevo_expediente/:id', function(req,res){
    let usuario = req.params.id;
    var date = new Date().toISOString().substr(0, 10).replace('T', ' ');

    sql.connect(config, function (err){
        if (err) console.log(err);
        var request = new sql.Request();

        sentencia = `insert into EXPEDIENTE 
         (usuario, fecha_inicio)
         values ('${usuario}', '${date}')`;

        request.query(sentencia, function (err) {
            if (err) {
            console.log(err);
            // res.send("error");
             } else {
            console.log("si");
             };
         });
         
    });

    // regresar el id
    sql.connect(config, function (err){
        if (err) console.log(err);
        var request = new sql.Request();

        sentencia = `SELECT MAX(ID_expediente) id_expediente from EXPEDIENTE`;

        request.query(sentencia, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("error");
            } else {
                // console.log(recordset);
                // console.log(recordset.recordset[0]['']);
                res.send(recordset.recordset);
            };
         });
         
    });

});

app.post('/nuevo_resolucion/', function(req,res){
    let ID_exp = req.body.ID_expediente;
    let resolucion = req.body.resolucion;

    var date = new Date().toISOString().substr(0, 10).replace('T', ' ');

    sql.connect(config, function (err){
        if (err) console.log(err);
        var request = new sql.Request();

        sentencia = `UPDATE EXPEDIENTE set resolucion = '${resolucion}', fecha_final = '${date}' where ID_expediente = '${ID_exp}'`;

        request.query(sentencia, function (err) {
            if (err) {
            console.log(err);
            res.send("error");
             } else {
            console.log("si");
             };
         });
         
    });

});


app.get('/api/usuarios/:correo', function (req, res) {  

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = "SELECT * FROM USUARIO where correo = '" + req.params.correo + "'";

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});

app.get('/api/miembros/:correo', function (req, res) {  

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = "SELECT * FROM MIEMBRO_TEE where correo = '" + req.params.correo + "'";

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});

app.get('/api/miembros/rol/:id', function (req, res) {  

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = "SELECT * FROM ROL where ID_mTEE = " + req.params.id;

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});




app.post('/nuevo_documento/', function(req,res){
    let nombre = req.body.nombre;
    let tipo = req.body.tipo;
    let expediente = req.body.expediente;
    let usuario = req.body.usuario;
    let ubicacion = req.body.ubicacion;

    let fecha = new Date().toISOString().substr(0, 10).replace('T', ' ');

    sql.connect(config, function (err){
        if (err) console.log(err);
        var request = new sql.Request();

        sentencia = `insert into DOCUMENTO 
         (nombre, tipo, ID_expediente, ID_Usuario, fecha, ubicacion) 
         values ('${nombre}', '${tipo}', '${expediente}', '${usuario}', '${fecha}', '${ubicacion}' )`;

        request.query(sentencia, function (err) {
            if (err) {
            console.log(err);
            res.send("error");
             } else {
            console.log("si");
             };
         });
         
    });

});

app.get('/nuevo_folio/:exp/:folio', function(req,res){
    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        sentencia = "update EXPEDIENTE set folio = '" + req.params.folio + "' where ID_expediente = " + req.params.exp;

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.send(recordset.recordset);
        });
    });
});



//NOTIFICACIONES
app.post('/nueva_notificacion/', function(req,res) { // crear notificacion
    let descripcion = req.body.descripcion;
    let receptor = req.body.receptor;
    let emisor = req.body.emisor;
    let expediente = req.body.expediente;

    let fecha_envio = new Date().toISOString().substr(0, 10).replace('T', ' ');
    
    sql.connect(config, function (err){
        if (err) console.log(err);
        var request = new sql.Request();

        sentencia = `insert into NOTIFICACION 
         (descripcion, fecha_envio, receptor, emisor, expediente) 
         values ('${descripcion}', '${fecha_envio}', '${receptor}', '${emisor}', '${expediente}')`;

        request.query(sentencia, function (err) {
            if (err) {
            console.log(err);
            res.send("error");
             } else {
            console.log("si");
             };
         });
         
    });

    sql.connect(config, function (err){
        if (err) console.log(err);
        var request = new sql.Request();

        sentencia = `select correo from USUARIO where ID_Usuario = ${receptor}`;

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err);

            if (recordset.recordset[0]){
                const correo = recordset.recordset[0].correo;

                var mailOptions = {
                    from: `${emailEnvios}`,
                    to: `${correo}`,
                    subject: `Nueva notificacion Caso ${expediente}`,
                    // text: `Ir al caso: `
                    html: `<a href='localhost:3000'>Ir al caso</a>`
                };
                
                transporter.sendMail(mailOptions, function(error, info) {
                    if(error) {
                        console.log(error);
                        res.send(error);
                    } else {
                        console.log('email sent: ' + info.response);
                        res.send('email sent: ' + info.response);
                    }
                })
            }
        });

         
    });

    

});

app.get('/notificacion/leer/:id', function (req, res) {  //agregar fecha de lectura

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var date = new Date().toISOString().substr(0, 10).replace('T', ' ');

        var request = new sql.Request();

        
        sentencia = `update NOTIFICACION set fecha_leido = '${date}' where ID_notificacion = ${req.params.id} and fecha_leido IS NULL`;

        console.log(sentencia);

        request.query(sentencia, function (err) {
            if (err) console.log(err)
            console.log('si')
            res.send('si');
        });

    });
});

app.get('/notificacion/mostrar/usuario/:id', function (req, res) {  //mostrar todas las notificaciones

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();
        
        sentencia = `select * from NOTIFICACION where receptor = ${req.params.id}`;
        console.log(sentencia);

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.json(recordset.recordset);
        });
    });
});

app.get('/api/notificacion/:usuario/:id_notificacion', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        sentencia = "select ID_notificacion, descripcion,folio,NOTIFICACION.expediente from NOTIFICACION JOIN EXPEDIENTE ON NOTIFICACION.expediente = EXPEDIENTE.ID_expediente where receptor = '" + req.params.usuario + 
        "'" + " AND ID_notificacion = '" + req.params.id_notificacion + "'"; 

        console.log(sentencia);
        request.query(sentencia, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset);
        });
    });
    
});

app.get('/api/casos_act/acuerdos/:usuario/:expediente', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        sentencia = "select EXPEDIENTE.ID_expediente,ID_documento,ubicacion,usuario,MIEMBRO_TEE.nombre,ap_paterno from EXPEDIENTE JOIN MIEMBRO_TEE ON EXPEDIENTE.representante = MIEMBRO_TEE.ID_miembroTEE JOIN DOCUMENTO ON DOCUMENTO.ID_expediente = EXPEDIENTE.ID_expediente where usuario = '" + 
        req.params.usuario + "' AND EXPEDIENTE.ID_expediente = '" + req.params.expediente + "'"; 
        console.log(sentencia);
        request.query(sentencia, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset);
            
        });
    });
    
});

app.get('/api/casos_act/acuerdosmag/:miembro/:expediente', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        sentencia = "select EXPEDIENTE.ID_expediente,ID_documento,ubicacion,usuario,MIEMBRO_TEE.nombre,ap_paterno from EXPEDIENTE JOIN MIEMBRO_TEE ON EXPEDIENTE.representante = MIEMBRO_TEE.ID_miembroTEE JOIN DOCUMENTO ON DOCUMENTO.ID_expediente = EXPEDIENTE.ID_expediente where representante = '" + 
        req.params.miembro + "' AND EXPEDIENTE.ID_expediente = '" + req.params.expediente + "'"; 
        console.log(sentencia);
        request.query(sentencia, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset);
            
        });
    });
    
});


app.get('/api/casos_act/reclamaciones/:usuario/:expediente', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        sentencia = "select * from DOCUMENTO where ID_Usuario = " + req.params.usuario + " and ID_expediente = " + req.params.expediente; 
        console.log(sentencia);
        request.query(sentencia, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset);
            
        });
    });
    
});

app.get('/notificacion/mostrar/expediente/:id', function (req, res) {  //mostrar todas las notificaciones

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();
        
        sentencia = `select * from NOTIFICACION where expediente = ${req.params.id}`;
        console.log(sentencia);

        request.query(sentencia, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            res.json(recordset.recordset);
        });
    });
});


// subir documento a drive
app.post('/documento/subir', async (req, res) => {

    console.log(req.body);

    let ID_expediente = req.body.ID_expediente;
    let ID_usuario = req.body.ID_usuario;
    let fecha = new Date().toISOString().substr(0, 10).replace('T', ' ');

    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {

            let doc = req.files.doc;
            
            const name = doc.name;
            const mimetype = doc.mimetype

            //Use the mv() method to place the file in the upload directory
            doc.mv('./uploads/' + doc.name);

            // subir a drive
            async function uploadFile(auth) {
                const driveService = google.drive({version: 'v3', auth});
                
                let fileMetadata = {
                    'name': name,
                    'parents':  ['1evo3mvvGKhkfrKN7uoSxeLRRP9M0HooA']
                };
        
                let media = {
                    mimeType: mimetype,
                    body: fs.createReadStream(`./uploads/${name}`)
                };
        
                let response = await driveService.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id'
                });
        
                switch(response.status){
                    case 200:
                        // let file = response.result;
                        console.log('Created File Id: ', response.data.id);
                        var address = `https://drive.google.com/file/d/${response.data.id}/preview`;
                        
                        res.send({
                                status: true,
                                message: 'File is uploaded',
                                data: {
                                    name: name,
                                    mimetype: mimetype,
                                    size: doc.size,
                                    address: address
                                }
                            });
                            
                        // verifica que existe el archivo
                        //fs.stat(`./uploads/${name}`, function (err, stats) {
                            // console.log(stats);
                            
                            //if (err) {
                            //    return console.error(err);
                            //}
                            
                            // elimina archivo local
                            //fs.unlink(`./uploads/${name}`, function(err){
                            //        if(err) return console.log(err);
                            //        console.log('file deleted successfully');
                            //});  
                            //});
                            

                            sql.connect(config, function (err){
                                if (err) console.log(err);
                                var request = new sql.Request();
                        
                                sentencia = `insert into DOCUMENTO (nombre, ID_expediente, ID_Usuario, ubicacion, fecha) 
                                 values ('${name}', '${ID_expediente}', '${ID_usuario}', '${address}', '${fecha}')`;

                                console.log(sentencia);
                        
                                request.query(sentencia, function (err) {
                                    if (err) {
                                    console.log(err);
                                    res.send("error");
                                     } else {
                                    console.log("si");
                                     };
                                 });
                                 
                            });

                        break;
                    default:
                        console.error('Error creating the file, ' + response.errors);
                        res.send('Error creating the file, ' + response.errors);
                        break;
                }
            }
            uploadFile(auth).catch(console.error);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// subir documento a drive
app.post('/documento/subirTEE', async (req, res) => {

    console.log(req.body);

    let ID_expediente = req.body.ID_expediente;
    let ID_usuario = req.body.ID_usuario;
    let fecha = new Date().toISOString().substr(0, 10).replace('T', ' ');

    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {

            let doc = req.files.doc;
            
            const name = doc.name;
            const mimetype = doc.mimetype

            //Use the mv() method to place the file in the upload directory
            doc.mv('./uploads/' + doc.name);

            // subir a drive
            async function uploadFile(auth) {
                const driveService = google.drive({version: 'v3', auth});
                
                let fileMetadata = {
                    'name': name,
                    'parents':  ['1evo3mvvGKhkfrKN7uoSxeLRRP9M0HooA']
                };
        
                let media = {
                    mimeType: mimetype,
                    body: fs.createReadStream(`./uploads/${name}`)
                };
        
                let response = await driveService.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id'
                });
        
                switch(response.status){
                    case 200:
                        // let file = response.result;
                        console.log('Created File Id: ', response.data.id);
                        var address = `https://drive.google.com/file/d/${response.data.id}/preview`;
                        
                        res.send({
                                status: true,
                                message: 'File is uploaded',
                                data: {
                                    name: name,
                                    mimetype: mimetype,
                                    size: doc.size,
                                    address: address
                                }
                            });
                            
                        // verifica que existe el archivo
                        //fs.stat(`./uploads/${name}`, function (err, stats) {
                            // console.log(stats);
                            
                            //if (err) {
                            //    return console.error(err);
                            //}
                            
                            // elimina archivo local
                            //fs.unlink(`./uploads/${name}`, function(err){
                            //        if(err) return console.log(err);
                            //        console.log('file deleted successfully');
                            //});  
                            //});
                            

                            sql.connect(config, function (err){
                                if (err) console.log(err);
                                var request = new sql.Request();
                        
                                sentencia = `insert into DOCUMENTO (nombre, ID_expediente, ID_miembro, ubicacion, fecha) 
                                 values ('${name}', '${ID_expediente}', '${ID_usuario}', '${address}', '${fecha}')`;

                                console.log(sentencia);
                        
                                request.query(sentencia, function (err) {
                                    if (err) {
                                    console.log(err);
                                    res.send("error");
                                     } else {
                                    console.log("si");
                                     };
                                 });
                                 
                            });

                        break;
                    default:
                        console.error('Error creating the file, ' + response.errors);
                        res.send('Error creating the file, ' + response.errors);
                        break;
                }
            }
            uploadFile(auth).catch(console.error);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


app.listen(2023, () => console.log("Listening on port "));