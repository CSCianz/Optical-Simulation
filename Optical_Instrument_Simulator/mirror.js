function startup(){ // onload help function
     
        var docHeight = $(document).height(); 
        var scrollTop = $(window).scrollTop(); 
        $('.overlay-bg').show().css({'height' : docHeight}); 
        $('.popup'+1).show().css({'top': scrollTop+20+'px'}); 
    }
//concave1
$(function(){

		var $stageContainer = $("#container");
		var stageOffset = $stageContainer.offset();
		var offsetX = stageOffset.left;
		var offsetY = stageOffset.top;
		var object_name;
		var object_position_x;
		var imageCount = -1;
		var imageSrc = [
			"convex1.png","concave1.png","mirror1.png"
			
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
				$lense.data("url", "lense.png");
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
		var principal_axis = new Kinetic.Line({
				points: [$("#container").width()*0,$("#container").height()*0.5,$("#container").width(),$("#container").height()*0.5],
				stroke: 'black',
				strokeWidth: 2,
				lineCap: 'butt',
				lineJoin: 'bevel'
		});
		layer.add(principal_axis);
		
		var mouseToText = new Kinetic.Text({
			x: $("#container").width()*0.015,
			y: $("#container").height()*0.9,
			fontFamily: "Calibri",
			fontSize: $("#container").height()*0.06,
			fill: "black",
			stroke: null,
			text: ""
			});
		layer.add(mouseToText);

		$("#lensgroup").on("mouseover", function(){
			mouseToText.setText("Drag and Drop mirror to the experimental area");
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
				points: [15,$("#container").height()*0.5,15,$("#container").height()*0.3,10,$("#container").height()*0.35,15,$("#container").height()*0.3,20,$("#container").height()*0.35],
				id:"arrow",
				stroke: 'rebeccapurple',
				strokeWidth: 4,
				lineCap: 'butt',
				lineJoin: 'bevel',
				draggable:true,
				dragBoundFunc: function(pos) {
						return {
						  x: pos.x,
						  y: this.getAbsolutePosition().y
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
		stage.get('#arrow').remove();
		
		layer.add(arrow_object);
		stage.find("#arrow")[0].setX(20);		
		object_name="arrow";
		deleteray();
		deleteray2();
		deleteray1();
		layer.draw();
    });
	

	
	
	$stageContainer.droppable({
			drop: dragDrop,
	});
	var mirror_id;var ids;
	var mirror_1_name=null;
	var mirror_2_name=null;
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
		stage.get('#refracted_ray_convex').remove
		stage.get('#refracted_ray_convex1').remove();
		
	}
	function deleteray2()
	{	 //  layer.add(central_ray1);
		stage.get('#central_ray').remove();
	    stage.get('#reflected_ray_concave1').remove();
		stage.get('#incident_ray').remove();
		stage.get('#refracted_ray_convex').remove();
		stage.get('#refracted_ray_convex1').remove();
		stage.get('#refracted_ray_concave').remove();
		stage.get('#reflected_ray_concave').remove();
		stage.get('#reflected_ray_lense2_1').remove();
		stage.get('#reflected_ray_lense2_2').remove();
		stage.get('#reflected_ray_lense2_3').remove();
		stage.get('#reflected_ray_lense2_4').remove();
		stage.get('#image_1').remove();
		stage.get('#image_2').remove();
		stage.get('#image_3').remove();
		stage.get('#arr4').remove();
		stage.get('#arr5').remove();
		stage.get('#arr6').remove();
	}	

	function deleteray1(){
		
		stage.get('#image_slope2').remove();
		  stage.get('#image_slope1').remove();
		  stage.get('#refracted_ray_convex1').remove();
	}

	
	function dragDrop(e, ui) {

			var xxx = parseInt(ui.offset.left - offsetX);
			var yyy = parseInt(ui.offset.top - offsetY);
			
			var element = ui.draggable;
			var data = element.data("url");
			var theImage = element.data("image");
			
			if($(ui.helper).hasClass("lenses")){
				ids=$(ui.draggable).attr("id");
				console.log();					
				mirror_id=document.getElementById(ids);
				if (mirror_1_name==null)
				{				
					 var image = new Kinetic.Image({
						name: data,
						id: "lense_1",
						x: $("#container").width()*0.4,
						y: $("#container").height()*0.15,
						width:205,
						height:stage.getHeight()*0.7,
						image: theImage,
						draggable: false,
						dragBoundFunc: function(pos) {
								return {
								  x: pos.x,
								  y: this.getAbsolutePosition().y
								}
						} 
					});	
			
					//draw left 2f of the first lense
						var twof_1 = new Kinetic.Rect({
							x: $("#container").width()*0.2-10,
							y: ($("#container").height()*0.5)-10,
							width: 4,
							height: 20,
							fill: "blue",
							id:"2f_1",
							text:'the testing text'
						});
						//draw right 2f of the first lense
						var twof_2 = new Kinetic.Rect({
							x: $("#container").width()*0.8+8,
							y: ($("#container").height()*0.5)-10,
							width: 4,
							height: 20,
							fill: "blue",
							id:"2f_2"
						});
						//draw left f of the first lense
						var focal_1 = new Kinetic.Rect({
							x: $("#container").width()*0.35-11,
							y: ($("#container").height()*0.5)-10,
							width: 4,
							height: 20,
							fill: "blue",
							id:"f_1"        
						});	
						//draw right f of the first lense
						var focal_2= new Kinetic.Rect({
							x: $("#container").width()*0.65+9,
							y: ($("#container").height()*0.5)-10,
							width: 4,
							height: 20,
							fill: "blue",
							id:"f_2"        
						});	
					layer.add(twof_1);layer.add(focal_1);layer.add(twof_2);layer.add(focal_2);
					mirror_1_name=mirror_id.name;
				}
				
				
				
				else if(mirror_1_name!=null){//when two lenses already dropped into container, if we drop extra lense it will replace one of the lenses in the container 
					if (xxx<$("#container").width()*0.5){//if dropped position of thired lense is less than half of window it will replace first lense
						stage.get('#lense_1').remove();
						 var image = new Kinetic.Image({
							name: data,
							id: "lense_1",
							x: $("#container").width()*0.5-200,
							y: $("#container").height()*0.15,
							width:30,
							height:$("#container").height()*0.7,
							image: theImage,
							draggable: false,
							dragBoundFunc: function(pos) {
								return {
								  x: pos.x,
								  y: this.getAbsolutePosition().y
								}
							} 
						});	
						mirror_1_name=mirror_id.name;
						//Draw vertical_axis for lense_1
						stage.get('#vertical_axis1').remove();						
						var vertical_axis = new Kinetic.Rect({
								x: $("#container").width()*0.5-200+15,
								y: ($("#container").height()*0),
								width: 1.5,
								height: $("#container").height(),
								fill: "blue",
								id:"vertical_axis1",
								text:'the testing text'
						});
						layer.add(vertical_axis);
					}  					
					image.setDraggable(true);//After dropped second lense enabble already exist lense to be draggable
				}				
			}
		
		
			var obj;
			var mirror_instance;
			var mirror_1_position,mirror_2_position;
			var focal_point_mirror_2,x1,x2,height1,x3,y3,height3,x4,focal_point_mirror_1,slope_1,slope_2,slope_3,slope_4,slope_5;
			var mirror1_ray1_end_point_x,mirror1_ray1_end_point_y,mirror1_ray2_end_point_x,mirror1_ray2_end_point_y,intersect_point_1,intersect_point_2,intersect_point_3,idd,intersect_point_1_tri_squ,mirror2_ray_end_point_x,mirror2_ray_end_point_y,mirror3_ray_end_point_x,mirror3_ray_end_point_y;
			
	function drawImage()
	{
	
		if((mirror_1_name!=null)&& (object_name=="arrow")){
			
			
					if(object_name=="arrow"){
						object_position_x=stage.find("#arrow")[0].getPosition().x+13;
					}
					mirror_1_position=stage.find("#lense_1")[0].getPosition();//get the position of the first lense
					
					deleteray();
					deleteray2();
					deleteray1();
					
				//find slope between principal axis and the ray go through the optical center
			    	slope_1=($("#container").height()*0.2)/((mirror_1_position.x-65)-object_position_x);
				
		
					mirror1_ray1_end_point_y=(($("#container").width()*0.15)+2)*slope_1+$("#container").height()*0.5;
					mirror1_ray1_end_point_x=$("#container").width()*0.5;
				
			
				
			    	//draw ray from object to lense(half of principal ray)				
				var incident_ray = new Kinetic.Line({
					points: [object_position_x,$("#container").height()*0.3,$("#container").width()*0.5,$("#container").height()*0.3],
					stroke: 'black',
					strokeWidth: 2,
					lineCap: 'butt',
					id:'incident_ray',
					lineJoin: 'bevel'
				});													
				
				layer.add(incident_ray);
				
				
				
				
				if(mirror_1_name=="convex_lense"  || mirror_1_name=="plano_convex_lense" || mirror_1_name=="meniscus_lense"){
					focal_point_mirror_1=mirror_1_position.x+15+$("#container").width()*0.15;
				}else if(mirror_1_name=="concave_lense" || mirror_1_name=="plano_concave_lense"){
					focal_point_mirror_1=mirror_1_position.x+15-$("#container").width()*0.15;
				}
				
			 


				
				
				
			//do if the dropped lense is Convex Lense
			
				
			if(mirror_1_name=="convex_lense" || mirror_1_name=="meniscus_lense"){


							if(object_position_x>mirror_1_position.x+95-$("#container").width()*0.15)   
							{   
						
						      //find slope between principal axis and the ray go through the optical center
								slope_3=Math.abs(($("#container").height()*0.2)/(object_position_x-(($("#container").width()*0.2)-10)));
				
			
								mirror2_ray_end_point_x=(($("#container").width()*0.8)+10)*slope_3;
								mirror2_ray_end_point_y=$("#container").width()*0.8;
						
						
						     //find slope between principal axis and the ray go through the optical center
								slope_4=(($("#container").height()*0.2)/mirror_1_position.x-($("#container").width()*0.35)-11);
				
			
								mirror3_ray_end_point_x=(($("#container").width()*0.65)+11)*slope_4;
								mirror3_ray_end_point_y=$("#container").width()*0.73;
						
						
								
									var reflected_ray = new Kinetic.Line({
										points: [intersect_point_1.x,intersect_point_1.y,x4,$("#container").height()*0.3],
										stroke: 'black',
										strokeWidth: 2,
										lineCap: 'butt',
										dashArray: [29, 1, 0.001, 1],
										id:idd,
										lineJoin: 'bevel'
									});								
							        		
							
									 
								     var refracted_ray_convex1= new Kinetic.Line({
							         points: [mirror_1_position.x+110,$("#container").height()*0.3,80,$("#container").height()*0.8501],
							         stroke: 'black',
							         strokeWidth: 2,
							         lineCap: 'butt',
							         id:'refracted_ray_convex1',
							         lineJoin: 'bevel'
						             });
									
									 //draw central ray 
				                     var image_slope2= new Kinetic.Line({
							         points: [mirror_1_position.x+110,$("#container").height()*0.3,mirror3_ray_end_point_y,$("#container").height()*0.03],
							         stroke: 'black',
							         strokeWidth: 2,
							         lineCap: 'butt',
							         id:'image_slope2',
							         lineJoin: 'bevel'
						             });
									
									//draw ray from 2f to image 
					                 var image_slope1 = new Kinetic.Line({
							         points: [$("#container").width()*0.2-10,($("#container").height()*0.5),object_position_x,$("#container").height()*0.3,$("#container").width()*0.9,-mirror2_ray_end_point_x+$("#container").height()*0.585],
							         stroke: 'black',
							         strokeWidth: 2,
							         lineCap: 'butt',
							         id:'image_slope1',
							         lineJoin: 'bevel'
						             });
									layer.add(image_slope2);
									 layer.add(image_slope1);
									
									 layer.add(refracted_ray_convex1);
						     
								 
								  //find intesection point of principal ray and central ray in first lense
			            	     intersect_point_1=intersect(object_position_x,$("#container").height()*0.3,$("#container").width()*0.9,-mirror2_ray_end_point_x+$("#container").height()*0.585,$("#container").width()*0.5,$("#container").height()*0.3,mirror3_ray_end_point_y,$("#container").height()*0.03);
				          
							
				            if(object_name=="arrow"){
				        	   if(intersect_point_1.y>$("#container").height()*0.5){	
							     x1=intersect_point_1.y-5;
				               }
							
							   else{
							       x1=intersect_point_1.y+5;							
					           }
				            }
				
					    //draw the image of object if it is one lense experiment
				        
				         	   if(object_name=="arrow"){
						          var image_1 = new Kinetic.Line({
								  points: [intersect_point_1.x,$("#container").height()*0.5,intersect_point_1.x,intersect_point_1.y,intersect_point_1.x-5,x1,intersect_point_1.x,intersect_point_1.y,intersect_point_1.x+5,x1],
								  id:"image_1",
								  stroke: 'rebeccapurple',
								  strokeWidth: 3,
								  lineCap: 'butt',
								  lineJoin: 'bevel',
								  draggable:false
						          });
						  
						        layer.add(image_1);
					
					            }
				            
			            }				
									
						        	
						
					else{
						
						
						
						
					   //draw ray from lense - focal point to border of box (half of principal ray)	
					        var refracted_ray_convex = new Kinetic.Line({
							points: [mirror_1_position.x+110,$("#container").height()*0.3,80,$("#container").height()*0.85],
							stroke: 'black',
							strokeWidth: 2,
							lineCap: 'butt',
							id:'refracted_ray_convex',
							lineJoin: 'bevel'
						    });
						

				        //draw central ray 
				            var central_ray = new Kinetic.Line({
					        points: [object_position_x,$("#container").height()*0.3,mirror_1_position.x-65,$("#container").height()*0.5,mirror1_ray1_end_point_x,mirror1_ray1_end_point_y,$("#container").width()*0,mirror1_ray1_end_point_y],
					        stroke: 'black',
					        strokeWidth: 2,
					        lineCap: 'butt',
					        id:'central_ray',
					        lineJoin: 'bevel'
			    	        });
				    
					    layer.add(central_ray);
					    layer.add(refracted_ray_convex);
			     
					    //find intesection point of principal ray and central ray in first lense
			            	intersect_point_1=intersect(mirror_1_position.x+110,$("#container").height()*0.3,80,$("#container").height()*0.85,mirror1_ray1_end_point_x,mirror1_ray1_end_point_y,$("#container").width()*0,mirror1_ray1_end_point_y);
				           
							
				            if(object_name=="arrow"){
				        	   if(intersect_point_1.y>$("#container").height()*0.5){	
							     x1=intersect_point_1.y-5;
				               }
							
							   else{
							       x1=intersect_point_1.y+5;							
					           }
				            }
				
					    //draw the image of object if it is one lense experiment
				            if(mirror_2_name==null){
				         	   if(object_name=="arrow"){
						          var image_1 = new Kinetic.Line({
								  points: [intersect_point_1.x,$("#container").height()*0.5,intersect_point_1.x,intersect_point_1.y,intersect_point_1.x-5,x1,intersect_point_1.x,intersect_point_1.y,intersect_point_1.x+5,x1],
								  id:"image_1",
								  stroke: 'rebeccapurple',
								  strokeWidth: 3,
								  lineCap: 'butt',
								  lineJoin: 'bevel',
								  draggable:false
						          });
						  
						        layer.add(image_1);
					
					            }
				            }
			            }				
			}
			
			
			else if(mirror_1_name=="concave_lense"){ //do if the dropped lense is Concave Lense
			
				deleteray();
				// Find slope between principal axis and principal ray of Concave lense
				slope_3=Math.abs($("#container").height()/($("#container").width()*0.15));
				if(mirror_2_name==null){
					mirror1_ray2_end_point_y=mirror_1_position.y-15;
					mirror1_ray2_end_point_x=($("#container").height()*0.5/slope_3)+mirror_1_position.x+15-$("#container").width()*0.15;
				}
				else{
					mirror1_ray2_end_point_x=mirror_2_position.x+15;
					mirror1_ray2_end_point_y=$("#container").height()*0.5-(mirror_2_position.x-(mirror_1_position.x-$("#container").width()*0.15))*slope_3;
				}
				
		
				var refracted_ray_concave = new Kinetic.Line({
					points: [mirror_1_position.x+100,$("#container").height()*0.3,mirror1_ray2_end_point_x,mirror1_ray2_end_point_y],
					stroke: 'black',
					strokeWidth: 2,
					lineCap: 'butt',
					id:'refracted_ray_concave',
					lineJoin: 'bevel'
				});
				var reflected_ray_concave1 = new Kinetic.Line({
					points: [mirror_1_position.x+100,$("#container").height()*0.3,mirror_1_position.x+420-$("#container").width()*0.15+20,$("#container").height()*0.5],
					stroke: 'red',
					strokeWidth: 2,
					lineCap: 'butt',
					dashArray: [29, 1, 0.001, 1],
					id:'reflected_ray_concave1',
					lineJoin: 'bevel'
				});
				//draw central ray
				var central_ray = new Kinetic.Line({
					points: [object_position_x,$("#container").height()*0.3, $("#container").width()*0.8+8,($("#container").height()*0.5)],
					stroke: 'black',
					strokeWidth: 2,
					lineCap: 'butt',
					id:'central_ray',
					lineJoin: 'bevel'
				});
			 
				layer.add(central_ray);
				layer.add(refracted_ray_concave);
				layer.add(reflected_ray_concave1);
				
				
					//find intesection point of principal ray and central ray in first lense
				intersect_point_2=intersect(object_position_x,$("#container").height()*0.3, $("#container").width()*0.8+8,($("#container").height()*0.5),mirror_1_position.x+100,$("#container").height()*0.3,mirror_1_position.x+420-$("#container").width()*0.15+20,$("#container").height()*0.5);
				
				if(object_name=="arrow"){
					if(intersect_point_2.y>$("#container").height()*0.5){
							x1=intersect_point_2.y-5;
					}else{
							x1=intersect_point_2.y+5;
					}
				}
				//draw the image of object if it is one lense experiment
				
					if(object_name=="arrow"){
						var image_1 = new Kinetic.Line({
								points: [intersect_point_2.x,$("#container").height()*0.5,intersect_point_2.x,intersect_point_2.y,intersect_point_2.x-5,x1,intersect_point_2.x,intersect_point_2.y,intersect_point_2.x+5,x1],
								id:"image_1",
								stroke: 'green',
								strokeWidth: 3,
								lineCap: 'butt',
								lineJoin: 'bevel',
								draggable:false
						});

						layer.add(image_1);
					}	
				
			}
			
			else if(mirror_1_name=="plano_convex_lense"){	//do if the dropped lense is Convex Lense					
					
		
				    //draw central ray 
				var central_ray = new Kinetic.Line({
					points: [object_position_x,$("#container").height()*0.3,mirror_1_position.x+100,$("#container").height()*0.5,$("#container").width()-object_position_x,$("#container").height()*0.3,object_position_x,$("#container").height()*0.3],
					stroke: 'black',
					strokeWidth: 2,
					lineCap: 'butt',
					id:'central_ray',
					lineJoin: 'bevel'
				});
				
					layer.add(central_ray);
					
				
				    
					//find intesection point of principal ray and central ray in first lense
				intersect_point_2=intersect(mirror_1_position.x+100,$("#container").height()*0.5,$("#container").width()-object_position_x,$("#container").height()*0.3,$("#container").width()*0,$("#container").height()*0.3,$("#container").width(),$("#container").height()*0.3)				
				if(object_name=="arrow"){
					if(intersect_point_2.y>$("#container").height()*0.5){	
							x1=intersect_point_2.y-5;
					}else{
							x1=intersect_point_2.y+5;							
					}
				}
				
					//draw the image of object if it is one lense experiment

					if(object_name=="arrow"){
						var image_1 = new Kinetic.Line({
								points: [intersect_point_2.x,$("#container").height()*0.5,intersect_point_2.x,intersect_point_2.y,intersect_point_2.x-5,x1,intersect_point_2.x,intersect_point_2.y,intersect_point_2.x+5,x1],
			
								//points: [$("#container").width()-object_position_x,$("#container").height()*0.5,$("#container").width()-object_position_x,$("#container").height()*0.3,($("#container").width()-object_position_x)],
								id:"image_1",
								stroke: 'black',
								strokeWidth: 3,
								lineCap: 'butt',
								lineJoin: 'bevel',
								draggable:false
						});
						
						layer.add(image_1);
					
					}
						
			}
			

		}
	}
			//dragmove function for Arrow object
			arrow_object.on("dragmove", function() {
				drawImage();
				arrow_object.setDragBoundFunc(function(pos){
						if(pos.x < mirror_1_position.x+70){
						return {
						  x: pos.x,
						  y: this.getAbsolutePosition().y
						}
						}else{
							return {
							  x: this.getAbsolutePosition().x,
							  y: this.getAbsolutePosition().y
							}
						}
				});

			});
	

			//double click the lenses to delete
			image.on('dblclick', function(evt) {
				var mirror_instance = evt.targetNode;
				var mirror_instance_id = mirror_instance.getId();
				image.remove();

				if(mirror_instance_id=="lense_1"){
					stage.get('#2f_1').remove();
					stage.get('#2f_2').remove();
					stage.get('#f_1').remove();
					stage.get('#f_2').remove();
					stage.get('#vertical_axis1').remove();

					if(mirror_2_name!=null){
						mirror_1_name=mirror_2_name;
						stage.find("#lense_2")[0].setId("lense_1");
						mirror_2_name=null;
						stage.find("#2f_3")[0].setId("2f_1");
						stage.find("#2f_4")[0].setId("2f_2");
						stage.find("#f_3")[0].setId("f_1");
						stage.find("#f_4")[0].setId("f_2");
						stage.find("#2f_1")[0].setFill("blue");
						stage.find("#2f_2")[0].setFill("blue");
						stage.find("#f_1")[0].setFill("blue");
						stage.find("#f_2")[0].setFill("blue");
						stage.find("#vertical_axis2")[0].setId("vertical_axis1");
					}else{
						mirror_1_name=null;
						stage.get('#central_ray').remove();
						stage.get('#incident_ray').remove();
						stage.get('#central_ray1').remove();
						stage.get('#refracted_ray_convex').remove();
						stage.get('#reflected_ray1_lense1').remove();
						stage.get('#reflected_ray2_lense1').remove();
						stage.get('#refracted_ray_concave').remove();
						stage.get('#reflected_ray_concave').remove();
						stage.get('#image_1').remove();
					    stage.get('#image_slope1').remove();
						stage.get('#refracted_ray_convex1').remove();
						  stage.get('#image_slope2').remove();
						  stage.get('#reflected_ray_concave1').remove();
					}
				}else if(mirror_instance_id=="lense_2"){
					mirror_2_name=null;
					stage.get('#2f_3').remove();
					stage.get('#2f_4').remove();
					stage.get('#f_3').remove();
					stage.get('#f_4').remove();
					stage.get('#vertical_axis2').remove();
					stage.find("#2f_1")[0].setFill("blue");
					stage.find("#2f_2")[0].setFill("blue");
					stage.find("#f_1")[0].setFill("blue");
					stage.find("#f_2")[0].setFill("blue");
				}
				if(mirror_1_name==null && mirror_2_name==null){
					if(object_name=="arrow"){
						stage.find("#arrow")[0].setX(20);
					}
					if(object_name=="triangle"){
						stage.find("#triangle")[0].setX(20);
					}
					if(object_name=="square"){
						stage.find("#square")[0].setX(20);
					}
				}
				layer.draw();
				drawImage();
			});

			image.on("mouseover", function(){
				mouseToText.setText("Double click to remove lens");
				layer.drawScene();
			});
		
			arrow_object.on("mouseover", function(){
				mouseToText.setText("Drag this Arrow horizontal to get ray diagram");
				layer.drawScene();
			});

			//dragmove function for lenses
			image.on("dragmove", function(evt) {
				drawImage();
				var mirror_instance = evt.targetNode;
				var mirror_instance_id = mirror_instance.getId();
				if(mirror_instance_id=="lense_1"){
					image.setDragBoundFunc(function(pos){
							if((pos.x > object_position_x+23) && (pos.x <mirror_2_position.x-20)){
							return {
							  x: pos.x,
							  y: this.getAbsolutePosition().y
							}
							}else{
								return {
								  x: this.getAbsolutePosition().x,
								  y: this.getAbsolutePosition().y
								}
							}
					});
				}else{
					image.setDragBoundFunc(function(pos){
							if(pos.x > mirror_1_position.x+28){
							return {
							  x: pos.x,
							  y: this.getAbsolutePosition().y
							}
							}else{
								return {
								  x: this.getAbsolutePosition().x,
								  y: this.getAbsolutePosition().y
								}
							}
					});
				}
				if(mirror_instance_id=="lense_1"){
					stage.find('#2f_1')[0].setX(mirror_1_position.x+13-$("#container").width()*0.3);
					stage.find('#2f_2')[0].setX(mirror_1_position.x+13+$("#container").width()*0.3);
					stage.find('#f_1')[0].setX(mirror_1_position.x+13-$("#container").width()*0.15);
					stage.find('#f_2')[0].setX(mirror_1_position.x+13+$("#container").width()*0.15);

					stage.find('#vertical_axis1')[0].setX(mirror_1_position.x+15);
				}
				else if(mirror_instance_id=="lense_2"){
					stage.find('#2f_3')[0].setX(mirror_2_position.x+13-$("#container").width()*0.3);
					stage.find('#2f_4')[0].setX(mirror_2_position.x+13+$("#container").width()*0.3);
					stage.find('#f_3')[0].setX(mirror_2_position.x+13-$("#container").width()*0.15);
					stage.find('#f_4')[0].setX(mirror_2_position.x+13+$("#container").width()*0.15);

					stage.find('#vertical_axis2')[0].setX(mirror_2_position.x+15);
				}
			});

			layer.add(image);
			layer.draw();
		}

		stage.add(layer);
});