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
			"fiber.png"

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


	

		var mouseToText = new Kinetic.Text({
			x: $("#container").width()*0.015,
			y: $("#container").height()*0.87,
			fontFamily: "Calibri",
			fontSize: $("#container").height()*0.06,
			fill: "black",
			stroke: null,
			text: ""
			});
		layer.add(mouseToText);

		$("#lensgroup").on("mouseover", function(){
			mouseToText.setText("Drag and Drop lens to the experimental area");
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
				points: [15,$("#container").height()*0.4-5,90,$("#container").height()*0.3+30,70,$("#container").height()*0.4,90,$("#container").height()*0.3+30,60,$("#container").height()*0.4-40],
				id:"arrow",
				stroke: 'black',
				strokeWidth: 10,
				lineCap: 'butt',
				lineJoin: 'bevel',
				draggable:true,
				dragBoundFunc: function(pos) {
						return {
						   x: this.getAbsolutePosition().x,
						   y: this.getAbsolutePosition().y
						   
						}
				}
	});



	document.getElementById('object_arrow').addEventListener('click', function() {
		stage.get('#arrow').remove();
		layer.add(arrow_object);
		stage.find("#arrow")[0].setX(20);
		object_name="arrow";
		
		layer.draw();
    });
	

	$stageContainer.droppable({
			drop: dragDrop,
	});
	var lense_id;var ids;
	var fiber_optic=null;
	

	function dragDrop(e, ui) {

			var xxx = parseInt(ui.offset.left - offsetX);
			var yyy = parseInt(ui.offset.top - offsetY);

			var element = ui.draggable;
			var data = element.data("url");
			var theImage = element.data("image");

			if($(ui.helper).hasClass("lenses")){
				ids=$(ui.draggable).attr("id");
				console.log();
				lense_id=document.getElementById(ids);
				if (fiber_optic==null)
				{
					 var image = new Kinetic.Image({
						name: data,
						id: "lense_1",
						x: $("#container").width()*0.2,
						y: $("#container").height()*0,
						width:700,
						height:stage.getHeight()*0.56,
						image: theImage,
						draggable: false,
						dragBoundFunc: function(pos) {
								return {
								  x: pos.x,
								  y: this.getAbsolutePosition().y
								}
						}
					});
				

					
					fiber_optic=lense_id.name;
				}
		
				
			}


			var obj;
			var lense_instance;
			var lense_1_position,lense_2_position;
			var focal_point_lense_2,x1,x2,height1,x3,y3,height3,x4,focal_point_lense_1,slope_1,slope_2,slope_3,slope_4,slope_5;
			var lense1_ray1_end_point_x,lense1_ray1_end_point_y,lense1_ray2_end_point_x,lense1_ray2_end_point_y,intersect_point_1,intersect_point_2,intersect_point_3,idd,intersect_point_1_tri_squ;

	    function drawImage()
	    {

		if((fiber_optic!=null) && (object_name=="arrow")){
					if(object_name=="arrow"){
						object_position_y=stage.find("#arrow")[0].getPosition().y+13;
					}
					lense_1_position=stage.find("#lense_1")[0].getPosition();//get the position of the optical_fiber
					
		
				
				//draw ray from object to optical_fiber
				var incident_ray = new Kinetic.Line({
					points: [$("#container").width()*0.1,$("#container").height()*0.3+30,lense_1_position.x+2,$("#container").height()*0.3-4],
					stroke: 'red',
					strokeWidth: 2,
					lineCap: 'butt',
					id:'incident_ray',
					lineJoin: 'bevel'
				});
				
				//draw ray inside the optical_fiber
				var reflected_ray1 = new Kinetic.Line({
					points: [lense_1_position.x,$("#container").height()*0.3-3,$("#container").width()*0.3+20,$("#container").height()*0.3-43,$("#container").width()*0.4+5,$("#container").height()*0.4-17,$("#container").width()*0.6-40,$("#container").height()*0.3+13,$("#container").width()*0.7+33,$("#container").height()*0.3+5,$("#container").width(),$("#container").height()*0.3-50],
					stroke: 'red',
					strokeWidth: 2,
					lineCap: 'butt',
					id:'reflected_ray1',
					lineJoin: 'bevel'
				});
				
			    layer.add(reflected_ray1);
				layer.add(incident_ray);
			
		
			

		}
	}
			//dragmove function for Arrow object
			arrow_object.on("dragmove", function() {
				drawImage();
				arrow_object.setDragBoundFunc(function(pos){
						if(pos.x < lense_1_position.x-40){
						return {
						  x: this.getAbsolutePosition().x,
						  y:  this.getAbsolutePosition().y
						}
						}else{
							return {
							  x: this.getAbsolutePosition().x,
							  y: this.getAbsolutePosition().y
							}
						}
				});

			});
		
			//double click the optical_Fiber to delete
			image.on('dblclick', function(evt) {
				var lense_instance = evt.targetNode;
				var lense_instance_id = lense_instance.getId();
				image.remove();

				if(lense_instance_id=="lense_1"){
					
						stage.get('#reflected_ray1').remove();
						stage.get('#incident_ray').remove();
				
				}
				
				if(fiber_optic==null){
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
		
			arrow_object.on("mouseover", function(){
				mouseToText.setText("Drag this Arrow horizontal to get ray diagram");
				layer.drawScene();
			});

			
			layer.add(image);
			layer.draw();
		}

		stage.add(layer);
});
