var data = [];
var yValue = 20;
var paused = 0;
var show = 0;

$(document).ready(function () {
        
            $('#jqChart').jqChart({
                title: { text: 'UBM13 GRAPH TEST' }, 
                
                legend: { visible: false }, 
                
                selectionRect: {
                    fillStyle: 'rgba(125,125,125,0.2)',
                    strokeStyle: 'gray',
                    lineWidth: 1
                },
                mouseInteractionMode: 'zooming', // zooming, panning 
                
                /*watermark: {
                    text: '© 2012-2013 UniBO MotorSports',
                    fillStyle: 'red',
                    font: '10px sans-serif',
                    hAlign: 'left',
                    vAlign: 'bottom'
                },*/
			    
			    series: [
                            {
                                type: 'line',
                                strokeStyle: '#0c2c7f',
                                data: data,
                                markers: {
                                    size: 5,
                                    type: 'circle',
                                    strokeStyle: '#FFFF00',
                                    fillStyle: '#d3031b',
                                    lineWidth: 1,
                                    //nullHandling: 'connect' o 'break' per unire l'ultimo valore conosciuto e l'ultimo acquisito in caso di mancanza di dato 
                                    nullHandling: 'connect'
                                }
                            }
                        ],
				axes: [
						{
                            type : 'linear',
                            location : 'left',
                            title: { text: 'Sensor Values', fillStyle : 'green' }
                        },
						{
                            type: 'dateTime',
                            location: 'bottom',
                            title: { text: 'Seconds', fillStyle : 'green' },
                            minimum: new Date(new Date().getTime()-10000),
                            maximum: new Date(),
                            interval: 1
                        }
                ]
            });

            updateChart();
        });


        function updateChart() {            

			yValue += Math.round(Math.random() * 20 - 10);
					
				// add a new element
				data.push([new Date(), yValue]);
				
            if (paused==0) 
			 {
			 if (data.length>100) 
				{
				 	data.splice(0, data.length-100);
				 }
			 $('#jqChart').jqChart('option', 'axes', [{
                            type : 'linear',
                            location : 'left',
                            title: { text: 'Sensor Values', fillStyle : 'green' }
                        },
						{
                            type: 'dateTime',
                            location: 'bottom',
                            title: { text: 'Seconds', fillStyle : 'green' },
                            minimum: new Date(new Date().getTime()-10000),
                            maximum: new Date(),
                            interval: 1
                        }]);
                        
                        $('#jqChart').jqChart('update');
			 }
			 setTimeout("updateChart()", 100);
        }
		
		function start()
		{
			paused = 0;
		}
		
		function pause()
		{
		   if(paused == 0)
		   {
		   		paused = 1;
		   
		   $('#jqChart').jqChart('option', 'axes', [{
                            type : 'linear',
                            location : 'left',
                            title: { text: 'Sensor Values', fillStyle : 'green' },
							zoomEnabled: true
                        },
						{
                            type: 'dateTime',
                            location: 'bottom',
                            title: { text: 'Seconds', fillStyle : 'green' },
                            minimum: new Date(new Date().getTime()-10000),
                            maximum: new Date(),
                            interval: 1,
							zoomEnabled: true
                        }]);
		   }
		   
		   function plot(string name)
		   {
		   		$(name).jqChart({
                title: { text: 'UBM13 GRAPH TEST' }, 
                
                legend: { visible: false }, 
                
                selectionRect: {
                    fillStyle: 'rgba(125,125,125,0.2)',
                    strokeStyle: 'gray',
                    lineWidth: 1
                },
                mouseInteractionMode: 'zooming', // zooming, panning 
                
                /*watermark: {
                    text: '© 2012-2013 UniBO MotorSports',
                    fillStyle: 'red',
                    font: '10px sans-serif',
                    hAlign: 'left',
                    vAlign: 'bottom'
                },*/
			    
			    series: [
                            {
                                type: 'line',
                                strokeStyle: '#0c2c7f',
                                data: data,
                                markers: {
                                    size: 5,
                                    type: 'circle',
                                    strokeStyle: '#FFFF00',
                                    fillStyle: '#d3031b',
                                    lineWidth: 1,
                                    //nullHandling: 'connect' o 'break' per unire l'ultimo valore conosciuto e l'ultimo acquisito in caso di mancanza di dato 
                                    nullHandling: 'connect'
                                }
                            }
                        ],
				axes: [
						{
                            type : 'linear',
                            location : 'left',
                            title: { text: 'Sensor Values', fillStyle : 'green' }
                        },
						{
                            type: 'dateTime',
                            location: 'bottom',
                            title: { text: 'Seconds', fillStyle : 'green' },
                            minimum: new Date(new Date().getTime()-10000),
                            maximum: new Date(),
                            interval: 1
                        }
                ]
            });
            updateChart();
		   }	
}