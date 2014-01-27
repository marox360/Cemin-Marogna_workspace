//process.title = 'telemetria';
process.chdir('/home/pi/server');
var webSocketsServerPort = 1337;
var portName = '/dev/ttyAMA0';

var WebSocketServer = require('websocket').server;
var http = require('http');
var serialport = require("serialport");
var SerialPort  = require('serialport').SerialPort;
var clients = [ ];

var exec = require('child_process').exec, child;

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(webSocketsServerPort, function() { 
	console.log((new Date()) + "Server listening on port " + webSocketsServerPort);
	
	var arraymio = [];
	setInterval(function()
	{
	for(i=0;i<23;i++)
	{
		arraymio[i] = Math.floor(Math.random()*255);
	}
		for(i=0;i<clients.length;i++){
        clients[i].sendUTF(JSON.stringify({time: (new Date()), data: arraymio}));
        }
        
	},100);
	
});

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

/*
function plInt(ch, bits) {
	if(ch=='N')
		return bits;
	var uf=0;
	var npunti=ch.length;
	for(k=0;k<npunti-1;k++){
		if(bits>=ch[k][0] && bits<=ch[k+1][0]){
			uf=ch[k][1]+((bits-ch[k][0])*ch[k+1][1]-(bits-ch[k][0])*ch[k][1])/(ch[k+1][0]-ch[k][0]);
		} 
		else if (bits<ch[0][0]) {
			uf=ch[k][1]+((bits-ch[0][0])*ch[1][1]-(bits-ch[0][0])*ch[0][1])/(ch[1][0]-ch[0][0]);
		} 
		else if (bits>ch[npunti-1][0]) {
			uf=ch[npunti-2][1]+((bits-ch[npunti-2][0])*ch[npunti-1][1]-(bits-ch[npunti-2][0])*ch[npunti-2][1])/(ch[npunti-1][0]-ch[npunti-2][0]);
		}
	}
	return uf.toFixed(3);
}
*/

/*********************************************/
/************ CARATTERISTICHE ****************/
/*********************************************/

/*
car=[
	[[50, 0.231], [100, 0.502], [150, 0.778], [200, 1.055], [250, 1.331]] //P-Airbox
	// [[4, 10], [41, 11], [60, 11.5], [78, 12], [111, 13], [139, 14], [153, 14.57], [158, 15], [171, 16], [180, 17], [190, 18], [198, 19], [206, 20], [213, 21], [220, 22], [226, 23], [231, 24], [235, 25], [241, 26], [245, 27], [249, 28], [252, 29]], // Lambda 1
	// [[3, 0], [50, 1.836], [100, 3.789], [150, 5.742], [200, 7.695], [250, 9.648]], //P-Oil
	// [[38, 20], [142, 50], [209, 80], [244, 110]], // T-Air
	// [[8, 0], [13, 10], [20, 20], [25, 25], [30, 30], [44, 40], [62, 50], [85, 60], [111, 70], [140, 80], [170, 90], [200, 100], [228, 110], [253, 120]] , //T-Oil
	// [[4, 0], [51, 1.836], [101, 3.789], [151, 5.742], [201, 7.695], [251, 9.648]] //p_benza
	// 'N', // V-Batt
	// 'N', // GP-Switch
	// [[64, 0], [87, 33.33], [110, 50], [148, 66.66], [250, 100]], //Angolo farfalla
	// [[0, 0], [127, 50], [255, 100]], //P-Freno ant 
	// [[0, 0], [127, 50], [255, 100]], //P-Freno post
	// [[0, 0], [255, 100]], // Angolo sterzo
	// [[0, 0], [255, 255]], // Pos frizione
	// [[15, -3], [56, -2], [97, -1], [139, 0], [178, 1], [217, 2]], //Acc_x
	// [[15, -3], [56, -2], [97, -1], [139, 0], [178, 1], [217, 2]], //Acc_y
	// [[21, -150], [58, -100], [95, -50], [132, 0], [168, 50], [205, 100], [241, 150]] //Giroscopio
	// [[0, 0], [255, 255]], // Giri motore
	// [[0, 0], [255, 255]], // Velocità
	// [[0, 0], [255, 255]] // Mappa
];
*/

//var sp = new SerialPort(portName, {baudrate: 19200, buffersize: 1024, parity: 1, parser: serialport.parsers.readline("\n")}); // instantiate the serial port.
/*sp.open(portName, { // portName is instatiated to be COM3, replace as necessary
   baudRate: 9600, // this is synced to what was set for the Arduino Code
   dataBits: 8, // this is the default for Arduino serial communication
   parity: 'none', // this is the default for Arduino serial communication
   stopBits: 1, // this is the default for Arduino serial communication
   flowControl: false // this is the default for Arduino serial communication
});*/

var bolgia=0;
var JSON_pack;

/*I sensori possono essere di 2 tipi:
	- true: sensori da plottare;
	- false: sensori da non plottare.*/

sp.on('data', function (data) {
	console.log(data.toString());
    var tobesent=data.toString();
	tobesent=tobesent.split("\t");
	tobesent.pop();
	
	//Converte i valori dei sensori da stringa a numero
	for(var counter = 0; counter < tobesent.length(); counter++) {
		tobesent[counter] = +tobesent[counter];
	}
    
    JSON_pack = {};
    //Engine 1
    JSON_pack.P_Air = {tobesent[1], true};
    JSON_pack.Lambda = {tobesent[2], true};
    JSON_pack.Throttle_Ang = {tobesent[3], true};
    JSON_pack.P_Oil = {tobesent[4], true};
    		
    //Engine 2
    JSON_pack.P_Fuel = {tobesent[5], true};
    JSON_pack.T_H2O = {tobesent[6], true};
    JSON_pack.T_Oil = {tobesent[7], true};
    JSON_pack.T_Air = {tobesent[8], true};
    		
    //Front_Sens_1
    JSON_pack.Steer_Ang = {tobesent[9], true};
    JSON_pack.P_Brake_F = {tobesent[10], true};
    JSON_pack.P_Brake_R = {tobesent[11], true};
    		
    //Front_Wheels
    JSON_pack.Damper_FL = {tobesent[12], true};
    JSON_pack.Damper_FR = {tobesent[13], true};
    		
    //Rear_Sens_1
    JSON_pack.T_Exhaust = {tobesent[14], true};
    		
    //Rear_Wheels
    JSON_pack.Damper_RL = {tobesent[15], true};
    JSON_pack.Damper_RR = {tobesent[16], true};
    		
    //Lap_Time
    JSON_pack.Remote_ID = {tobesent[17], false};
    JSON_pack.Last_Remote_Time = {tobesent[18], false};
    		
    //Inertial_Sens_1
    JSON_pack.Acc_Y = {tobesent[19], true};
    JSON_pack.Acc_X = {tobesent[20], true};
    		JSON_pack.Gyro = {tobesent[21], false};
    		JSON_pack.Comp = {tobesent[22], false};
    		
    		//Batt_Sens
    		JSON_pack.I_Batt = {tobesent[23], true};
    		JSON_pack.V_Batt = {tobesent[24], true};
    		JSON_pack.T_Batt = {tobesent[25], true};
    		
    	break;
    	
    	case 2:
    		
    		//Vehicle_Position
    		JSON_pack.Pos_X = {tobesent[1], false};
    		JSON_pack.Pos_Y = {tobesent[2], false};
    		
    		//Front_Left_Wheel_Temp
    		JSON_pack.T_Wheel_IFL = {tobesent[3], false};
    		JSON_pack.T_Wheel_CFL = {tobesent[4], false};
    		JSON_pack.T_Wheel_EFL = {tobesent[5], false};
    		JSON_pack.T_Brake_FL = {tobesent[6], false};
    		
    		//Front_Right_Wheel_Temp
    		JSON_pack.T_Wheel_IFR = {tobesent[7], false};
    		JSON_pack.T_Wheel_CFR = {tobesent[8], false};
    		JSON_pack.T_Wheel_EFR = {tobesent[9], false};
    		JSON_pack.T_Brake_FR = {tobesent[10], false};
    		
    		//Rear_Left_Wheel_Temp
    		JSON_pack.T_Wheel_IRL = {tobesent[11], false};
    		JSON_pack.T_Wheel_CRL = {tobesent[12], false};
    		JSON_pack.T_Wheel_ERL = {tobesent[13], false};
    		JSON_pack.T_Brake_RL = {tobesent[14], false};
    		
    		//Rear_Right_Wheel_Temp
    		JSON_pack.T_Wheel_IRR = {tobesent[15], false};
    		JSON_pack.T_Wheel_CRR = {tobesent[16], false};
    		JSON_pack.T_Wheel_ERR = {tobesent[17], false};
    		JSON_pack.T_Brake_RR = {tobesent[18], false};
    		
    		//Clutch_Status
    		JSON_pack.Clutch_Pos = {tobesent[19], true};
    		
    		for(i=0;i<clients.length;i++){
        		clients[i].sendUTF(JSON.stringify({time: (new Date()), data: JSON_pack}));
        	}		
    	break;
    }
    
	 //console.log(JSON.stringify({time: (new Date()), data: tobesent}));
	//console.log("X="+tobesent[12]+"\tY="+tobesent[13]+"\tGyro: "+tobesent[13]);
	// console.log('PORCO DIO!!!!!!!!!!!!');
   // console.log(JSON.stringify({time: (new Date()), val: data.toString()}));
//});

// WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) -1;
 /*   setInterval(function() {
      for(i=0;i<clients.length;i++){
        clients[i].sendUTF(JSON.stringify({time: (new Date()), val: Math.floor(Math.random()*11)}));
      }
    }, 1000);
*/
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
			console.log(message.utf8Data);
			if(Math.abs((new Date(message.utf8Data)).getTime()-(new Date()).getTime())>1000*15*60) {
				child = exec('sudo date --set="' + message.utf8Data + '"', function(error, stdout, stderr) {
					console.log('Date set to ' + stdout);
				});
			}
        }
    });

    connection.on('close', function(connection) {
        // close user connection
        console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
	clients.splice(index, 1);
    });
});


var static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new(static.Server)('./public', {cache: false});

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response, function (err, result) {
            if (err) { // There was an error serving the file
                console.error("Error serving " + request.url + " - " + err.message);

                // Respond to the client
                response.writeHead(404, 'Not found');
                
		response.end();
            }
        });
    });
}).listen(80);
