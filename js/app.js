var newImg, matriz, estasis, score, mov;
var limite=0;
var intervalo=0;
var eliminar=0;
var nuevasImagenes=0;
var longCol=["","","","","","",""];
var longVert=["","","","","","",""];
var tiempo=0;
var i=0;
var buscarFila=0;
var buscarColumna=0;
var contadorTotal=0;
var min=2;
var seg=0;

$(function(){
	titleMatchGame('.main-titulo');
	$(".btn-reinicio").click(function(){
		iniciarJuego();
	});

});

function iniciarJuego(){
	i=0;
	score=0;
	mov=0;
	$(".panel-score").css("width","25%");
	$(".panel-tablero").show();
	$(".moves").show();
	$(".time").show();
	$("#score-text").html("0");
	$("#movimientos-text").html("0");
	$(this).html("Reiniciar")
	clearInterval(intervalo);
	clearInterval(eliminar);
	clearInterval(nuevasImagenes);
	clearInterval(tiempo);
	min=2;
	seg=0;
	clean();
	intervalo=setInterval(function(){
		desplazamiento()
	},600);
	tiempo=setInterval(function(){
		timer()
	},1000);
}

//Función que nos permite desplazar las fichas del juego
function desplazamiento(){
	var numImg;
	$(".imagen").draggable({disabled:true});
		$("div[class^='col-']").each(function(){
			if($(this).children("img:nth-child("+i+")").html()==null){
				numImg=Math.floor(Math.random()*4)+1;
				$(this).prepend("<img src=image/"+numImg+".png class='imagen'/>").css("justify-content","flex-start")
			}
	  });
	i++
	if(i==8){
		clearInterval(intervalo);
		eliminar=setInterval(function(){
			eliminarCoincidencias()
		},150);
	}
}

//Función que elimina las imagenes al conseguir coincidencias (minimo 3)
function eliminarCoincidencias(){
	matriz=0;
	buscarFila=coincidenciaHorizontal();
	buscarColumna=coincidenciaVertical();
	$("div[class^='col-']").each(function(){
		matriz += $(this).children().length;
	});
	if(buscarFila==0 && buscarColumna==0 && matriz!=49){
		clearInterval(eliminar);
		newImg=0;
		nuevasImagenes=setInterval(function(){
			nuevasimagenes()
		},600);
	}

	if(buscarFila==1||buscarColumna==1){
		$(".imagen").draggable({disabled:true});
		$("div[class^='col']").css("justify-content","flex-end");
		$(".activo").hide("pulsate",1000,function(){
			score+=($(".activo").length)*10;
			$(".activo").remove("img");
			$("#score-text").html(score);
		});
	}
	if(buscarFila==0 && buscarColumna==0 && matriz==49){
		$(".imagen").draggable({
			disabled:false,
			containment:".panel-tablero",
			revert:true,
			revertDuration:0,
			snap:".imagen",
			snapMode:"inner",
			snapTolerance:40,
			start:function(event,ui){
				mov++;
				$("#movimientos-text").html(mov);
			}
		});
	}
	$(".imagen").droppable({
		drop:function (event,ui){
			var dropped=ui.draggable;
			var droppedOn=this;
			estasis=0;
			do{
				estasis=dropped.swap($(droppedOn));
				//console.log(estasis)
			}while(estasis==0);
			buscarFila=coincidenciaHorizontal();
			buscarColumna=coincidenciaVertical();
			if(buscarFila==0 && buscarColumna==0){
				dropped.swap($(droppedOn));
			}
			if(buscarFila==1 || buscarColumna==1){
				clearInterval(nuevasImagenes);
				clearInterval(eliminar);
				eliminar=setInterval(function(){
					eliminarCoincidencias()
				},150);
			}
		},
	});
}

//function que intercambia las posicion de las imagenes
jQuery.fn.swap=function(b){
	b=jQuery(b)[0];
	var a=this[0];
	var t=a.parentNode.insertBefore(document.createTextNode(''),a);
	b.parentNode.insertBefore(a,b);
	t.parentNode.insertBefore(b,t);
	t.parentNode.removeChild(t);
	return this;
}

function nuevasimagenes(){
	$(".imagen").draggable({disabled:true});
	$("div[class^='col']").css("justify-content","flex-start")
	$("div[class^='col-']").each(function(index){
		longCol[index]= ($(this).children().length);
  });
	if(newImg==0){
		for(var j=0;j<7;j++){
			longVert[j]=(7-longCol[j]);
		}
		limite=Math.max.apply(null,longVert);
		contadorTotal=limite;
	}
	if(limite!=0){
		if(newImg==1){
			$("div[class^='col-']").each(function(index){
				if(contadorTotal>(limite-longVert[index])){
					$(this).children("img:nth-child("+(longVert[index])+")").remove("img");
				}
		  });
		}
		if(newImg==0){
			newImg=1;
			$("div[class^='col-']").each(function(index){
				for(var j=0;j<(longVert[index]-1);j++){
					$(this).prepend("<img src='' class='imagen' style='visibility:hidden'/>");
				}
		  });
		}
		$("div[class^='col-']").each(function(index){
			if(contadorTotal>(limite-longVert[index])){
				numero=Math.floor(Math.random()*4)+1;
				$(this).prepend("<img src=image/"+numero+".png class='imagen'/>");
			}
		});
	}
	if(contadorTotal==1){
		clearInterval(nuevasImagenes);
		eliminar=setInterval(function(){
			eliminarCoincidencias()
		},150);
	}
	contadorTotal--;
};

//Función que busca coincidencias horizontales
function coincidenciaHorizontal(){
	var encuentraHorizontal=0;
	var pos1, pos2,pos3;
	for(var j=1;j<8;j++){
		for(var k=1;k<6;k++){
			pos1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src");
			pos2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src");
			pos3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src");
			if((pos1==pos2) && (pos2==pos3) && (pos1!=null) && (pos2!=null) && (pos3!=null)){
				$(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","imagen activo");
				$(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","imagen activo");
				$(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","imagen activo");
				encuentraHorizontal=1;
			}
		}
	}
	return encuentraHorizontal;
};

//Función que busca coincidencias verticales
function coincidenciaVertical(){
	var encuentraVertical=0;
	var pos1, pos2,pos3;
	for(var l=1;l<6;l++){
		$("div[class^='col-']").each(function(){
			pos1=$(this).children("img:nth-child("+(l)+")").attr("src");
			pos2=$(this).children("img:nth-child("+(l+1)+")").attr("src");
			pos3=$(this).children("img:nth-child("+(l+2)+")").attr("src");
			if((pos1==pos2) && (pos2==pos3) && (pos1!=null) && (pos2!=null) && (pos3!=null)){
				$(this).children("img:nth-child("+(l)+")").attr("class","imagen activo");
				$(this).children("img:nth-child("+(l+1)+")").attr("class","imagen activo");
				$(this).children("img:nth-child("+(l+2)+")").attr("class","imagen activo");
				encuentraVertical=1;
			}
		});
	}
	return encuentraVertical;
}

//Función que muestra la puntuación y el numero de movimientos al terminar el tiempo de juego
function timeOut(){
	$('.btn-reinicio').hide();
	$( ".panel-score" ).animate({
		width:'100%'
	},3000, function(){
		$('.btn-reinicio').show();
	});
	$(".termino").css({
		"display":"block",
		"text-align":
		"center"
	});
};

//Función que limpia el tablero al reiniciar el juego
function clean(){
	$("div[class^='col-']").children("img").detach();
};

//Función que nos permite controlar el tiempo de Juego
function timer(){
	if(seg!=0){
		seg--;}
	if(seg==0){
		if(min==0){
			clearInterval(eliminar);
			clearInterval(nuevasImagenes);
			clearInterval(intervalo);
			clearInterval(tiempo);
			$(".panel-tablero").hide("drop","slow",timeOut);
			$(".time").hide();
			seg=0;
			min=2;
		}else {
			seg=59;
			min--;
		}
	}
	if (seg<10){
		$("#timer").html("0"+min+":0"+seg);
	} else{
		$("#timer").html("0"+min+":"+seg);
	}

} //Fin timer()

function titleMatchGame(titulo) {
	$(titulo).animate({
			opacity: '2',
		}, {
			step: function () {
				$(this).css('color', 'white');
			},
			queue: true
		})
		.animate({
			opacity: '2'
		}, {
			step: function () {
				$(this).css('color', 'yellow');
				titleMatchGame('.main-titulo');
			},
			queue: true
		});
}
