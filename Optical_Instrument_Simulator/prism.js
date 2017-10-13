function startup(){ // onload help function

        var docHeight = $(document).height();
        var scrollTop = $(window).scrollTop();
        $('.overlay-bg').show().css({'height' : docHeight});
        $('.popup'+1).show().css({'top': scrollTop+20+'px'});
    }

$(function(){

		var $stageContainer = $("#container");
		var stageOffset = $stageContainer.offset();
		var offsetX = stageOffset.left;
		var offsetY = stageOffset.top;
		var object_name;
		var object_position_x;
		var imageCount = -1;
		var imageSrc = [
			"triangle1.png","triangle2.png"

		];

    $('#help1').click(function(event){
        event.preventDefault();
		startup();
    });

    // hide popup when user clicks on close button or if user clicks anywhere outside the container
    $('.close-btn, .overlay-bg').click(function(){
        $('.overlay-bg, .overlay-content').hide(); // hide the overlay
    });

    // hide the popup when user presses the esc key
    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // if user presses esc key
            $('.overlay-bg, .overlay-content').hide(); //hide the overlay
        }
    });



		for (var i = 0; i  < imageSrc.length; i++) {
			(function() {
				var $lense, image;
				var $lense = $("#lense"+i);
				$lense.hide();
				image = new Image();
				image.onload = function () {
					$lense.show();
				}
				image.src = imageSrc[i];
				$lense.draggable({helper: 'clone'});
				$lense.data("image", image);
			})();
		}

    var stage = new Kinetic.Stage({
        container: 'container',
        width: $("#container").width(),
        height: window.innerHeight * 0.95,
        listening: true
    });

	var layer = new Kinetic.Layer();


		//draw line
	

		var mouseToText = new Kinetic.Text({
			x: $("#container").width()*0.015,
			y: $("#container").height()*0.867,
			fontFamily: "Calibri",
			fontSize: $("#container").height()*0.06,
			fill: "black",
			stroke: null,
			text: ""
			});
		layer.add(mouseToText);

		$("#lensgroup").on("mouseover", function(){
			mouseToText.setText("Drag and Drop prism to the experimental area");
			layer.drawScene();
		});
		$("#objectgroup").on("mouseover", function(){
			mouseToText.setText("Click one of these objects");
			layer.drawScene();
		});
		$("#reset").on("mouseover", function(){
			mouseToText.setText("Click on reset to reset this experiment");
			layer.drawScene();
		});
		$("#help1").on("mouseover", function(){
			mouseToText.setText("Click on help to get help");
			layer.drawScene();
		});

	//draw Arrow after click toolbar Arrow
	var arrow_object = new Kinetic.Line({
				points: [15,$("#container").height()*0.3,80,$("#container").height()*0.3,60,$("#container").height()*0.35,80,$("#container").height()*0.3,60,$("#container").height()*0.25],
				id:"arrow",
				stroke: 'black',
				strokeWidth: 10,
				lineCap: 'butt',
				lineJoin: 'bevel',
				draggable:true,
				dragBoundFunc: function(pos) {
						return {
						   x: this.getAbsolutePosition().x,
						   y: pos.y
						   
						}
				}
	});

	var triangle_object = new Kinetic.Polygon({
		x:10,
		id:"triangle",
		y: stage.getHeight()*0.5,
		stroke : "red",
		strokeWidth : 2,
		points : [ 0, 0, 30, 0, 30, -$("#container").height()*0.2+7],
		fill: "blue",
		draggable : true,
		dragBoundFunc: function(pos) {
			return {
				x: pos.x,
				y: this.getAbsolutePosition().y,
			};
		  }
	});

	var square_object = new Kinetic.Polygon({
		x:10,
		y: stage.getHeight()*0.5,
		points: [0,0,0,-$("#container").height()*0.2+4,30,-$("#container").height()*0.2+4,30,0,0,0],
		id:"square",
		fill:'green',
		stroke: 'black',
		strokeWidth: 2,
		draggable:true,
        closed: true,
		dragBoundFunc: function(pos) {
			return {
			  x: pos.x,
			  y: this.getAbsolutePosition().y
			}
		}
	});
	document.getElementById('object_arrow').addEventListener('click', function() {
		
		layer.add(arrow_object);
		stage.find("#arrow")[0].setX(20);
		object_name="arrow";
		deleteray();
		deleteray2();
		layer.draw();
    });

	layer.draw();

	$stageContainer.droppable({
			drop: dragDrop,
	});
	var prism_id;var ids;
	var prism_1_name=null;
	var prism_2_name=null;
	var obs,obs1,image1posi,xx,yy;
	
	
	 //find the intersected point of two lines
	function intersect(x1,y1,x2,y2,x3,y3,x4,y4){
		var d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
		if (d == 0) return null;

		var xi = ((x3-x4)*(x1*y2-y1*x2)-(x1-x2)*(x3*y4-y3*x4))/d;
		var yi = ((y3-y4)*(x1*y2-y1*x2)-(y1-y2)*(x3*y4-y3*x4))/d;

		return {x:xi,y:yi};
	} 

	function deleteray()
	{
		stage.get('#reflected_ray1_lense1').remove();
		stage.get('#reflected_ray2_lense1').remove();
		
	}
	function deleteray2()
	{
	
		stage.get('#incident_ray').remove();
		stage.get('#out_side_ray').remove();
		stage.get('#orthogonally_ray').remove();
		stage.get('#refracted_ray').remove();
		
		stage.get('#refracted_ray_R').remove();
		stage.get('#refracted_ray_O').remove();
		stage.get('#refracted_ray_Y').remove();
		stage.get('#refracted_ray_G').remove();
		stage.get('#refracted_ray_B').remove();
		stage.get('#refracted_ray_I').remove();
		stage.get('#refracted_ray_V').remove(); 
		
	}

	function dragDrop(e, ui) {

			var xxx = parseInt(ui.offset.left - offsetX);
			var yyy = parseInt(ui.offset.top - offsetY);

			var element = ui.draggable;
			var data = element.data("url");
			var theImage = element.data("image");

			if($(ui.helper).hasClass("prism")){
				ids=$(ui.draggable).attr("id");
				console.log();
				prism_id=document.getElementById(ids);
				if (prism_1_name==null)
				{
					 var image = new Kinetic.Image({
						name: data,
						id: "lense_1",
						x: $("#container").width()*0.4-15,
						y: $("#container").height()*0,
						width:250,
						height:stage.getHeight()*0.57,
						image: theImage,
						draggable: false,
						dragBoundFunc: function(pos) {
								return {
								  x: pos.x,
								  y: this.getAbsolutePosition().y
								}
						}
					});
			
					
					prism_1_name=prism_id.name;
				}
		
				
			}

	    function drawImage()
	    {

		if((prism_1_name!=null) && (object_name=="arrow")){
					if(object_name=="arrow"){
						object_position_y=stage.find("#arrow")[0].getPosition().y+13;
					}
					
					prism_1_position=stage.find("#lense_1")[0].getPosition();//get the position of the prism
					
					deleteray();
				deleteray2();
				
				//find slope between principal axis and the ray go through the optical center 0.00022
				slope_1=(prism_1_position.x+60+object_position_x)/4800;

		
				//find slope between principal axis and the ray go through the focal point
				slope_2=($("#container").height()*0.025)/($("#container").width()*15);
				
				if(prism_2_name==null){
					prism1_ray2_end_point_y=($("#container").width()*0.85-(prism_1_position.x+15))*slope_2+$("#container").height()*0.5;
					prism1_ray2_end_point_x=$("#container").width();
				} else{
					prism1_ray2_end_point_y=(prism_2_position.x-(prism_1_position.x+$("#container").width()*0.15))*slope_2+$("#container").height()*0.5;
					prism1_ray2_end_point_x=prism_2_position.x-50;
				}
				
				
				
				
				
				
				//draw ray from object to prism
				var incident_ray = new Kinetic.Line({
					points: [100,object_position_y+165,prism_1_position.x+60,$("#container").height()*0.3],
					stroke: 'black',
					strokeWidth: 2,
					lineCap: 'butt',
					id:'incident_ray',
					lineJoin: 'bevel'
				});
				
			
				layer.add(incident_ray);
			
				
				
			if(prism_1_name=="prism0"){	//do if the dropped lense is Convex Lense
					
			 var refracted_ray = new Kinetic.Line({
				    points: [prism_1_position.x+58,$("#container").height()*0.3,prism1_ray2_end_point_x-475,$("#container").height()*0.3],
					stroke: 'black',
					strokeWidth: 2,
					lineCap: 'butt',
					id:'refracted_ray',
					lineJoin: 'bevel'
                    });
					
			//draw Orthogonally ray 0.000770
			var orthogonally_ray = new Kinetic.Line({
				points: [$("#container").width()*0.5,$("#container").height()*0.3+25,$("#container").width()*0.4,$("#container").height()*0.2+45],
				stroke: 'blue',
				strokeWidth: 2,
				dashArray: [5, 1, 0.001, 1],
				lineCap: 'butt',
				id:'orthogonally_ray',
				lineJoin: 'bevel'
			    });
				
			    //draw Orthogonally ray 0.000770
				var orthogonally_ray1 = new Kinetic.Line({
				points: [$("#container").width()*0.5,$("#container").height()*0.3+25,$("#container").width()*0.6+25,$("#container").height()*0.2+35],
				stroke: 'blue',
				strokeWidth: 2,
				dashArray: [5, 1, 0.001, 1],
				lineCap: 'butt',
				id:'orthogonally_ray1',
				lineJoin: 'bevel'
			    	});
					
				//draw outside ray 0.000770
				var out_side_ray = new Kinetic.Line({
				points: [prism1_ray2_end_point_x-475,$("#container").height()*0.3,$("#container").width()*0.5+($("#container").width()+100),$("#container").height()-2.5*object_position_y],
				stroke: 'black',
				strokeWidth: 2,
				lineCap: 'butt',
				id:'out_side_ray',
				lineJoin: 'bevel'
			    	});
					
				layer.add(out_side_ray);
				layer.add(orthogonally_ray);					
				layer.add(orthogonally_ray1);
				layer.add(refracted_ray);
					
					
				

				
					
			}else if(prism_1_name=="prism1"){
				
					/* draw spectrum 
					********************************************** */
						//Draw vertical_axis for lense_1
					var vertical_axis = new Kinetic.Rect({
							x: $("#container").width()*0.8-2,
							y: ($("#container").height()*0),
							width: 1.5,
							height: $("#container").height(),
							fill: "blue",
							id:"vertical_axis1",
							text:'the testing text'
					});
					layer.add(vertical_axis);
					 
				    var refracted_ray_R = new Kinetic.Line({
				    points: [prism_1_position.x+60,$("#container").height()*0.3,prism1_ray2_end_point_x-470,prism1_ray2_end_point_y-110,$("#container").width()*0.8,prism_1_position.x-8*object_position_y+20],
					stroke: 'red',
					strokeWidth: 8,
					lineCap: 'butt',
					id:'refracted_ray_R',
					lineJoin: 'bevel'
                    });
					
					var refracted_ray_O = new Kinetic.Line({
				    points: [prism_1_position.x+60,$("#container").height()*0.3,prism1_ray2_end_point_x-465,prism1_ray2_end_point_y-100,$("#container").width()*0.8,prism_1_position.x-8*object_position_y+30],
					stroke: 'orange',
					strokeWidth: 8,
					lineCap: 'butt',
					id:'refracted_ray_O',
					lineJoin: 'bevel'
                    });

			    var refracted_ray_Y = new Kinetic.Line({
				    points: [prism_1_position.x+60,$("#container").height()*0.3,prism1_ray2_end_point_x-460,prism1_ray2_end_point_y-90,$("#container").width()*0.8,prism_1_position.x-8*object_position_y+40],
					stroke: 'yellow',
					strokeWidth: 8,
					lineCap: 'butt',
					id:'refracted_ray_Y',
					lineJoin: 'bevel'
                    });
					
				var refracted_ray_G = new Kinetic.Line({
				    points: [prism_1_position.x+60,$("#container").height()*0.3,prism1_ray2_end_point_x-455,prism1_ray2_end_point_y-80,$("#container").width()*0.8,prism_1_position.x-8*object_position_y+50],
					stroke: 'green',
					strokeWidth: 8,
					lineCap: 'butt',
					id:'refracted_ray_G',
					lineJoin: 'bevel'
                    });
					
				var refracted_ray_B = new Kinetic.Line({
				    points: [prism_1_position.x+60,$("#container").height()*0.3,prism1_ray2_end_point_x-450,prism1_ray2_end_point_y-70,$("#container").width()*0.8,prism_1_position.x-8*object_position_y+60],
					stroke: 'blue',
					strokeWidth: 8,
					lineCap: 'butt',
					id:'refracted_ray_B',
					lineJoin: 'bevel'
                    });
					
				var refracted_ray_I = new Kinetic.Line({
				    points: [prism_1_position.x+60,$("#container").height()*0.3,prism1_ray2_end_point_x-445,prism1_ray2_end_point_y-60,$("#container").width()*0.8,prism_1_position.x-8*object_position_y+70],
					stroke: 'indigo',
					strokeWidth: 8,
					lineCap: 'butt',
					id:'refracted_ray_I',
					lineJoin: 'bevel'
                    });
					
			    var refracted_ray_V = new Kinetic.Line({
				    points: [prism_1_position.x+60,$("#container").height()*0.3,prism1_ray2_end_point_x-440,prism1_ray2_end_point_y-50,$("#container").width()*0.8,prism_1_position.x-8*object_position_y+80],
					stroke: 'violet',
					strokeWidth: 8,
					lineCap: 'butt',
					id:'refracted_ray_V',
					lineJoin: 'bevel'
                    });
					layer.add(refracted_ray_R);
					layer.add(refracted_ray_O);
					layer.add(refracted_ray_Y);
					layer.add(refracted_ray_G);
					layer.add(refracted_ray_B);
					layer.add(refracted_ray_I);
					layer.add(refracted_ray_V);
					 
					
			}
			

		}
	}
			//dragmove function for Arrow object
			arrow_object.on("dragmove", function() {
				drawImage();
				arrow_object.setDragBoundFunc(function(pos){
						if(pos.x < prism_1_position.x-40){
						return {
						  x: this.getAbsolutePosition().x,
						  y: pos.y
						}
						}else{
							return {
							  x: this.getAbsolutePosition().x,
							  y: this.getAbsolutePosition().y
							}
						}
				});

			});
			
			
			//double click the prism to delete
			image.on('dblclick', function(evt) {
				var prism_instance = evt.targetNode;
				var prism_instance_id = prism_instance.getId();
				image.remove();
					
				
					if(prism_1_name=null)
						{
						stage.get('#central_ray').remove();
						stage.get('#incident_ray').remove();
						
						stage.get('#reflected_ray1_lense1').remove();
						stage.get('#reflected_ray2_lense1').remove();
						
						stage.get('#image_1').remove();
						stage.get('#refracted_ray_R').remove();
						stage.get('#refracted_ray_O').remove();
						stage.get('#refracted_ray_Y').remove();
						stage.get('#refracted_ray_G').remove();
						stage.get('#refracted_ray_B').remove();
						stage.get('#refracted_ray_I').remove();
						stage.get('#refracted_ray_V').remove();
						stage.get('#out_side_ray').remove();
						stage.get('#orthogonally_ray').remove();
						stage.get('#refracted_ray').remove();
						
					}
				
				if(prism_1_name==null){
					if(object_name=="arrow"){
						stage.find("#arrow")[0].setX(20);
					}

					
				}
				layer.draw();
				drawImage();
			});

			image.on("mouseover", function(){
				mouseToText.setText("Double click to remove lens");
				layer.drawScene();
			});
			square_object.on("mouseover", function(){
				mouseToText.setText("Drag this polygon horizontal to get ray diagram");
				layer.drawScene();
			});
			triangle_object.on("mouseover", function(){
				mouseToText.setText("Drag this Triangle horizontal to get ray diagram");
				layer.drawScene();
			});
			arrow_object.on("mouseover", function(){
				mouseToText.setText("Drag this Arrow horizontal to get ray diagram");
				layer.drawScene();
			});

			layer.add(image);
			layer.draw();
		}

		stage.add(layer);
});
