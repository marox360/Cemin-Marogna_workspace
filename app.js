//Process.title = 'telemetria';
process.chdir('/home/pi/server');
var webSocketsServerPort = 1337;
var portName = '/dev/ttyAMA0';

var WebSocketServer = require('websocket').server;
var http = require('http');
var serialport = require("serialport");
var SerialPort  = require('serialport').SerialPort;
var clients = [ ];
var allowedUsers = [ ];

var exec = require('child_process').exec, child;

var JSON_dataPack;
var JSON_sensorsList;

var ch = [];
ch.P_Fuel = {6, [39, 80, 121, 162, 203, 244], [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]};
ch.P_Air = {5, [52, 101, 150, 197, 242], [0.231, 0.502, 0.778, 1.055, 1.331]};
ch.GP_Switch = {7, [1, 255, 2, 3, 4, 5, 6], [-1, 0, 1, 2, 3, 4, 5]};
ch.Lambda = {15, [15,55,76,96,132,164,178, 184, 197, 207, 217, 226, 234, 241, 249], [0.69, 0.75, 0.79, 0.82, 0.89, 0.96, 1, 1.03, 1.1, 1.17, 1.24, 1.3, 1.37, 1.44, 1.51]};
ch.Lambda1 = {15, [15,55,76,96,132,164,178, 184, 197, 207, 217, 226, 234, 241, 249], [0.69, 0.75, 0.79, 0.82, 0.89, 0.96, 1, 1.03, 1.1, 1.17, 1.24, 1.3, 1.37, 1.44, 1.51]};
ch.Lambda2 = {15, [15,55,76,96,132,164,178, 184, 197, 207, 217, 226, 234, 241, 249], [0.69, 0.75, 0.79, 0.82, 0.89, 0.96, 1, 1.03, 1.1, 1.17, 1.24, 1.3, 1.37, 1.44, 1.51]};
ch.Throttle_Ang = {2, [0, 255], [0, 100]};
ch.Lambda3 = {15, [15,55,76,96,132,164,178, 184, 197, 207, 217, 226, 234, 241, 249], [0.69, 0.75, 0.79, 0.82, 0.89, 0.96, 1, 1.03, 1.1, 1.17, 1.24, 1.3, 1.37, 1.44, 1.51]};
ch.Lambda4 = {15, [15,55,76,96,132,164,178, 184, 197, 207, 217, 226, 234, 241, 249], [0.69, 0.75, 0.79, 0.82, 0.89, 0.96, 1, 1.03, 1.1, 1.17, 1.24, 1.3, 1.37, 1.44, 1.51]};
ch.Lambda5 = {15, [15,55,76,96,132,164,178, 184, 197, 207, 217, 226, 234, 241, 249], [0.69, 0.75, 0.79, 0.82, 0.89, 0.96, 1, 1.03, 1.1, 1.17, 1.24, 1.3, 1.37, 1.44, 1.51]};
ch.P_Oil = {10, [24, 50, 76, 102, 127, 153, 178, 202, 222, 240], [1,2,3,4,5,6,7,8,9,10]};
ch.T_Air = {8, [218, 188, 151, 115, 85, 65, 48, 35], [-10, 0, 10 ,20, 30, 40, 50, 60, 70]};
ch.DamperRR = {2, [0, 255], [0, 255]};
ch.T_H2O = {8, [218, 195, 165, 135, 86, 71, 56, 46], [50, 60, 70, 80, 90, 100, 110, 120, 130]};
ch.DamperRL = {2, [0, 255], [0, 255]};
ch.Acc_X = {3, [61, 127, 189], [-1, 0, 1]};
ch.Damper_FR = {2, [0, 255], [0, 255]};
ch.Damper_FL = {2, [0, 255], [0, 255]};
ch.Gyro = {3, [0, 128, 250], [-180, 0, 180]};
ch.Acc_Y = {3, [67, 128, 192], [-1, 0, 1]};
ch.P_Brake_R = {10, [24, 50, 76, 101, 127, 152, 177, 200, 220, 235], [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]};
ch.P_Brake_F = {10, [24, 50, 76, 101, 127, 152, 177, 200, 220, 235], [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]};
ch.Fuel_Tank_Lev = {2, [0, 255], [0, 255]};
//ch.T_Exhaust = {2, [0, 255], [0, 255]};
ch.Steer_Ang = {2, [9, 246], [-100, 100]};
ch.V_Batt = {2, [0, 255], [0, 255]};
ch.I_Batt = {2, [0, 255], [0, 255]};
//ch.T_Batt = {2, [0, 255], [0, 255]};
ch.T_Oil = {2, [0, 255], [0, 255]};
ch.Pos_X = {2, [0, 255], [0, 255]};
ch.Pos_Y = {2, [0, 255], [0, 255]};
ch.Clutch_Pos = {2, [0, 255], [0, 255]};
ch.T_Wheel_IFL = {2, [0, 255], [0, 255]};
ch.T_Wheel_CFL = {2, [0, 255], [0, 255]};
ch.T_Wheel_EFL = {2, [0, 255], [0, 255]};
ch.T_Brake_FL = {2, [0, 255], [0, 255]};
ch.T_Wheel_IFR = {2, [0, 255], [0, 255]};
ch.T_Wheel_CFR = {2, [0, 255], [0, 255]};
ch.T_Wheel_EFR = {2, [0, 255], [0, 255]};
ch.T_Brake_FR = {2, [0, 255], [0, 255]};
ch.T_Wheel_IRL = {2, [0, 255], [0, 255]};
ch.T_Wheel_CRL = {2, [0, 255], [0, 255]};
ch.T_Wheel_ERL = {2, [0, 255], [0, 255]};
ch.T_Brake_RL = {2, [0, 255], [0, 255]};
ch.T_Wheel_IRR = {2, [0, 255], [0, 255]};
ch.T_Wheel_CRR = {2, [0, 255], [0, 255]};
ch.T_Wheel_ERR = {2, [0, 255], [0, 255]};
ch.T_Brake_RR = {2, [0, 255], [0, 255]};
ch.RPM = {2, [0, 255], [0, 255]};
ch.Speed = {2, [0, 255], [0, 255]};
ch.Map = {2, [0, 255], [0, 255]};
ch.Gear = {2, [0, 255], [0, 255]};
ch.TCS_Lev = {2, [0, 255], [0, 255]};
ch.LCS = {2, [0, 255], [0, 255]};
ch.TCS_Count = {2, [0, 255], [0, 255]};
ch.Ign_Adv = {2, [0, 255], [0, 255]};

function plInt(var ch, var bits)
{
	var uf = 0;
	var k;
	for (k=0; k<(ch[0]-1); k++)
	{
		if (bits >= ch[1][k] && bits <= ch[1][k+1])
		{
			uf = ch[2][k]+ ((bits-ch[1][k])*ch[2][k+1]- (bits-ch[1][k])*ch[2][k])/(ch[1][k+1]-ch[1][k]);
		}
		else if (bits> ch[1][ch[0]-1])
		{
			uf = ch[2][0];
		}
		else if (bits > ch[1][ch[0]-1])
		{
			uf = ch[2][ch[0]-1];
		}
	}
}

var server = http.createServer(function(request, response) 
{
    /* Process HTTP request. Since we're writing just WebSockets server
	we don't have to implement anything.*/
});

server.listen(webSocketsServerPort, function() 
{ 
	console.log((new Date()) + "Server listening on port " + webSocketsServerPort);
	
	/*
	//Funzione che manda valori random per simulare
	var randValsArray = [];
	setInterval(function()
	{
		for(counter = 0; counter < JSON_dataPack.length; counter++)
		{
			randValsArray[counter] = Math.floor(Math.random()*255);
		}
		for(counter = 0; counter < clients.length; counter++)
		{
        	clients[counter].sendUTF(JSON.stringify({time: (new Date()), data: randValsArray}));
        }
        
	},100);*/
});

// create the server
wsServer = new WebSocketServer({httpServer: server});


var sp = new SerialPort(portName, {baudrate: 115200, buffersize: 1024, parser: serialport.parsers.readline("\n")}); // instantiate the serial port.

/*I sensori possono essere di 2 tipi:
	- true: sensori da plottare;
	- false: sensori da non plottare.*/
	
var np=0;

sp.on('data', function (data) 
{
    var tobesent = data.toString();
	tobesent = tobesent.split("\t");
	tobesent.pop();
	
	//Converte i valori dei sensori da stringa a numero
	for(var counter = 0; counter < tobesent.length; counter++) 
	{
		tobesent[counter] = +tobesent[counter];
	}
	console.log(tobesent);
	//console.log("Engine 1",tobesent[0],tobesent[1],tobesent[2],"Engine 2",tobesent[3],tobesent[4],tobesent[5],tobesent[6],tobesent[7],np++,"\n");
        		
    for(counter = 0; counter < clients.length; counter++)
    {
    	clients[counter].sendUTF(JSON.stringify({time: (new Date()), data: setDataPack(tobesent)}));
    }
    
	//console.log(JSON.stringify({time: (new Date()), data: tobesent}));
	//console.log("X="+tobesent[12]+"\tY="+tobesent[13]+"\tGyro: "+tobesent[13]);
	// console.log('PORCO DIO!!!!!!!!!!!!');
    // console.log(JSON.stringify({time: (new Date()), val: data.toString()}));
});

// WebSocket server
wsServer.on('request', function(request) 
{
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) -1;
    
    //Invio al client la lista dei sensori appena si apre la connessione
    //connection.sendUTF(JSON.stringify(setSensorsList()));
    clients[index].sendUTF(JSON.stringify(setSensorsList()));
    
    
    /*This is the most important callback for us, we'll handle
    all messages from users here.*/
    connection.on('message', function(message) 
    {
        if (message.type === 'utf8') 
        {
           		if (message.utf8Data.length == 10)
           		{
           			if (allowedUsers.indexOf(connection.remoteAddress) >= 0)
           			{
           				var comando;
           				comando = message.utf8Data;
            			console.log(comando);
            			sp.write(comando);
            		}
            		else
            		{
            			console.log("Accesso negato a: " + connection.remoteAddress);
            		}
           		}
           		else if (message.utf8Data.length == 32)
           		{
           			if (message.utf8Data == "33c9bbabfa3691087d7f8a4b540b22f0")
           			{
           				allowedUsers.push(connection.remoteAddress); 
           				console.log("User allowed now: " + connection.remoteAddress);
           			}
           		}
           		else {
           			//Process WebSocket message
					console.log(message.utf8Data);
					if(Math.abs((new Date(message.utf8Data)).getTime()-(new Date()).getTime()) > 1000*15*60) 
					{
						child = exec('sudo date --set="' + message.utf8Data + '"', function(error, stdout, stderr) 
						{
							console.log('Date set to ' + stdout);
						});
					}
				}
        }
    });

    connection.on('close', function(connection) 
    {
        //Close user connection
        var indice;
        indice = allowedUsers.indexOf(connection.remoteAddress)
        if (indice >= 0)
        {
        	//lo rimuovo dalla lista
        	allowedUsers.splice(indice, 1);
        	
        }
        console.log((new Date()) + " Peer "+ connection + " disconnected.");
		clients.splice(index, 1);
    });
});

var static = require('node-static');

//Create a node-static server instance to serve the './public' folder

var file = new(static.Server)('./public', {cache: false});

require('http').createServer(function (request, response) 
{
    request.addListener('end', function () 
    {
        // Serve files!

        file.serve(request, response, function (err, result) 
        {
            if (err) 
            { 
            	//There was an error serving the file
                console.error("Error serving " + request.url + " - " + err.message);

                // Respond to the client
                response.writeHead(404, 'Not found');
                
				response.end();
            }
        });
    });
}).listen(80);

function setSensorsList()
{
	JSON_sensorsList = {};
	
	//Engine 1
    JSON_sensorsList.P_Air = true;
    JSON_sensorsList.Lambda = true;
    JSON_sensorsList.Throttle_Ang = true;
    JSON_sensorsList.P_Oil = true;
    		
    //Engine 2
    JSON_sensorsList.P_Fuel = true;
    JSON_sensorsList.T_H2O = true;
    JSON_sensorsList.T_Oil = true;
    JSON_sensorsList.T_Air = true;
    		
    //Front_Sens_1
    JSON_sensorsList.Steer_Ang = true;
    JSON_sensorsList.P_Brake_F = true;
    JSON_sensorsList.P_Brake_R = true;
    		
    //Front_Wheels
    JSON_sensorsList.Damper_FL = true;
    JSON_sensorsList.Damper_FR = true;
    		
    //Rear_Sens_1
    JSON_sensorsList.Fuel_Tank_Lev = false;
    		
    //Rear_Wheels
    JSON_sensorsList.Damper_RL = true;
    JSON_sensorsList.Damper_RR = true;
    		
    //Lap_Time
    JSON_sensorsList.Remote_ID = false;
    JSON_sensorsList.Last_Remote_Time = false;
    		
    //Inertial_Sens_1
    JSON_sensorsList.Acc_Y = true;
    JSON_sensorsList.Acc_X = true;
    JSON_sensorsList.Gyro = false;
    JSON_sensorsList.Comp = false;
    
    //Vehicle_Position
    JSON_sensorsList.Pos_X = false;
    JSON_sensorsList.Pos_Y = false;
    
    //Clutch_Status
    JSON_sensorsList.Clutch_Pos = true;
    		
    //Batt_Sens
    JSON_sensorsList.I_Batt = true;
    JSON_sensorsList.V_Batt = true;
    //T_Batt è stato tolto!
    		
    //Front_Left_Wheel_Temp
    JSON_sensorsList.T_Wheel_IFL = false;
    JSON_sensorsList.T_Wheel_CFL = false;
    JSON_sensorsList.T_Wheel_EFL = false;
    JSON_sensorsList.T_Brake_FL = false;
    
    //Front_Right_Wheel_Temp
    JSON_sensorsList.T_Wheel_IFR = false;
    JSON_sensorsList.T_Wheel_CFR = false;
    JSON_sensorsList.T_Wheel_EFR = false;
    JSON_sensorsList.T_Brake_FR = false;
    		
    //Rear_Left_Wheel_Temp
    JSON_sensorsList.T_Wheel_IRL = false;
    JSON_sensorsList.T_Wheel_CRL = false;
    JSON_sensorsList.T_Wheel_ERL = false;
    JSON_sensorsList.T_Brake_RL = false;
    		
    //Rear_Right_Wheel_Temp
    JSON_sensorsList.T_Wheel_IRR = false;
    JSON_sensorsList.T_Wheel_CRR = false;
    JSON_sensorsList.T_Wheel_ERR = false;
    JSON_sensorsList.T_Brake_RR = false;
    
    //Rotary_Switch
    JSON_sensorsList.RPM = false;
    JSON_sensorsList.Speed = false;
    JSON_sensorsList.Map = false;
    JSON_sensorsList.Gear = false;
    JSON_sensorsList.TCS_Lev = false;
    JSON_sensorsList.LCS = false;
    JSON_sensorsList.TCS_Count = false;
    JSON_sensorsList.Ign_Adv = false;
    
    //PCB's RESETS
    //JSON_sensorsList.Resets = false;
    
    return JSON_sensorsList;
}

function setDataPack(tobesent)
{
	JSON_dataPack = {};
	
	//Engine 1
    JSON_dataPack.P_Air = plInt(ch.P_Air, tobesent[0]);
    JSON_dataPack.Lambda = plInt(ch.Lambda, tobesent[1]);
    JSON_dataPack.Throttle_Ang = plInt(ch.Throttle_Ang, tobesent[2]);
    JSON_dataPack.P_Oil = plInt(ch.P_Oil, tobesent[3]);
    		
    //Engine 2
    JSON_dataPack.P_Fuel = plInt(ch.P_Fuel, tobesent[4]);
    JSON_dataPack.T_H2O = plInt(ch._H2O, tobesent[5]);
    JSON_dataPack.T_Oil = plInt(ch.T_Oil, tobesent[6]);
    JSON_dataPack.T_Air = plInt(ch.T_Air, tobesent[7]);
    		
    //Front_Sens_1
    JSON_dataPack.Steer_Ang = plInt(ch.Steer_Ang, tobesent[8]);
    JSON_dataPack.P_Brake_F = plInt(ch.P_Brake_F, tobesent[9]);
    JSON_dataPack.P_Brake_R = plInt(ch.P_Brake_R, tobesent[10]);
    		
    //Front_Wheels
    JSON_dataPack.Damper_FL = plInt(ch.Damper_FL, tobesent[11]);
    JSON_dataPack.Damper_FR = plInt(ch.Damper_FR, tobesent[12]);
    		
    //E85
    JSON_dataPack.Fuel_Tank_Lev = plInt(ch.Fuel_Tank_Lev, tobesent[13]);
    		
    //Rear_Wheels
    JSON_dataPack.Damper_RL = plInt(ch.Damper_RL, tobesent[14]);
    JSON_dataPack.Damper_RR = plInt(ch.Damper_RR, tobesent[15]);
    		
    //Lap_Time
    JSON_dataPack.Remote_ID = tobesent[16];
    JSON_dataPack.Last_Remote_Time = tobesent[17];
    		
    //Inertial_Sens_1
    JSON_dataPack.Acc_Y = plInt(ch.Acc_Y, tobesent[18]);
    JSON_dataPack.Acc_X = plInt(ch.Acc_X, tobesent[19]);
    JSON_dataPack.Gyro = plInt(ch.Gyro, tobesent[20]);
    JSON_dataPack.Comp = plInt(ch.Comp, tobesent[21]);
    
    //Vehicle_Position
    JSON_dataPack.Pos_X = plInt(ch.Pos_X, tobesent[22]);
    JSON_dataPack.Pos_Y = plInt(ch.Pos_Y, tobesent[23]);
    
    //Clutch_Status
    JSON_dataPack.Clutch_Pos = plInt(ch.Clutch_Pos, tobesent[24]);
    		
    //Batt_Sens
    JSON_dataPack.I_Batt = plInt(ch.I_Batt, tobesent[25]);
    JSON_dataPack.V_Batt = plInt(ch.V_Batt, tobesent[26]);
    		
    //Front_Left_Wheel_Temp
    JSON_dataPack.T_Wheel_IFL = plInt(ch.T_Wheel_IFL, tobesent[27]);
    JSON_dataPack.T_Wheel_CFL = plInt(ch.T_Wheel_CFL, tobesent[28]);
    JSON_dataPack.T_Wheel_EFL = plInt(ch.T_Wheel_EFL, tobesent[29]);
    JSON_dataPack.T_Brake_FL = plInt(ch.T_Brake_FL, tobesent[30]);
    
    //Front_Right_Wheel_Temp
    JSON_dataPack.T_Wheel_IFR = plInt(ch._Wheel_IFR, tobesent[31]);
    JSON_dataPack.T_Wheel_CFR = plInt(ch.T_Wheel_CFR, tobesent[32]);
    JSON_dataPack.T_Wheel_EFR = plInt(ch.T_Wheel_EFR, tobesent[33]);
    JSON_dataPack.T_Brake_FR = plInt(ch.T_Brake_FR, tobesent[34]);
    		
    //Rear_Left_Wheel_Temp
    JSON_dataPack.T_Wheel_IRL = plInt(ch.T_Wheel_IRL, tobesent[35]);
    JSON_dataPack.T_Wheel_CRL = plInt(ch.T_Wheel_CRL, tobesent[36]);
    JSON_dataPack.T_Wheel_ERL = plInt(ch.T_Wheel_ERL, tobesent[37]);
    JSON_dataPack.T_Brake_RL = plInt(ch.T_Brake_RL, tobesent[38]);
    		
    //Rear_Right_Wheel_Temp
    JSON_dataPack.T_Wheel_IRR = plInt(ch.T_Wheel_IRR, tobesent[39]);
    JSON_dataPack.T_Wheel_CRR = plInt(ch.T_Wheel_CRR, tobesent[40]);
    JSON_dataPack.T_Wheel_ERR = plInt(ch.T_Wheel_ERR, tobesent[41]);
    JSON_dataPack.T_Brake_RR = plInt(ch.T_Brake_RR, tobesent[42]);
    
    //Rotary_Switch
    JSON_dataPack.RPM = plInt(ch.RPM, tobesent[43]);
    JSON_dataPack.Speed = plInt(ch.Speed, tobesent[44]);
    JSON_dataPack.Map = plInt(ch.Map, tobesent[45]);
    JSON_dataPack.Gear = plInt(ch.Gear, tobesent[46]);
    JSON_dataPack.TCS_Lev = plInt(ch.TCS_Lev, tobesent[47]);
    JSON_dataPack.LCS = plInt(ch.LCS, tobesent[48]);
    JSON_dataPack.TCS_Count = plInt(ch.TCS_Count, tobesent[49]);
    JSON_dataPack.Ign_Adv = plInt(ch.Ign_Adv, tobesent[50]);
    
    //PCB's RESETS
    //JSON_dataPack.Resets = tobesent[51];
    
    return JSON_dataPack;
}