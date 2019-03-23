window.onload=init;
function init(){
	 videoPlayer=document.getElementById("videoPlayer");
	 bufferCanvas=document.getElementById("buffer");
	 displayCanvas=document.getElementById("display");
	 buffer=bufferCanvas.getContext("2d");
	 display=displayCanvas.getContext("2d");
	 effectInterval=0;
	 effectNormalInterval=0;


	var playlist=getPlaylist();
	showPlaylist(playlist);
	var lis=document.getElementsByTagName("li");
	for (var i = 0; i < lis.length; i++) {
		lis[i].onclick=liClick;
	}
	
	videoPlayer.onended=nextVideo;
	displayCanvas.onclick=play;

	initButton();


}

function getPlaylist(){
	var playlist=["1","2","3"];
	return playlist;
}

function showPlaylist(playlist){
	for (var i = 0; i < playlist.length; i++) {
		var li=document.createElement("li");
		var ul=document.getElementById("ul");
		li.appendChild(document.createTextNode(playlist[i]));
		ul.appendChild(li);
	}
}

function liClick(){
	var videoPlayer=document.getElementById("videoPlayer");
	var liText=this.firstChild.nodeValue;
	// alert(liText);
	videoPlayer.src=liText+getVideoCanPlay();
	videoPlayer.autoplay=true;


}

function getVideoCanPlay(){
	if(videoPlayer.canPlayType("video/mp4")!="")
		return ".mp4";
	else if(videoPlayer.canPlayType("video/webm")!="")
		return ".webm";
	else if(videoPlayer.canPlayType("video/ogg")!="")
		return ".ogv";

}

function nextVideo(){
	var playlist=getPlaylist();
	var currentVideoSrc=this.src;
	currentVideoArray=currentVideoSrc.split("/");
	currentVideo=currentVideoArray[currentVideoArray.length-1];
	// alert(currentVideo);
	var nextVideoIndex;
	for (var i = 0; i < playlist.length; i++) {
		if(playlist[i]==currentVideo){
			if(i==playlist.length-1)
				nextVideoIndex=0;
			else
				nextVideoIndex=i+1;

		}
	}
	// alert(nextVideoIndex);
	var nextVideo=playlist[nextVideoIndex];
	this.src=nextVideo;
}

function initButton(){
	var as=document.getElementsByTagName("a");
	for (var i = 0; i < as.length; i++) {
		as[i].onclick=aClick;
	}
}

function aClick(){
	
	switch(this.id){
		case "play": play();break;
		case "pause":play();break;
		case "loop":loop();break;
		case "mute":mute();break;
		case "normal":clearInterval(effectInterval);clearInterval(effectNormalInterval);effectNormalInterval=setInterval('normal()',0);break;
		case "gray":clearInterval(effectInterval);clearInterval(effectNormalInterval);effectInterval=setInterval('gray()',0);break;
		case "black":clearInterval(effectInterval);clearInterval(effectNormalInterval);effectInterval=setInterval('black()',0);break;
		case "convert":clearInterval(effectInterval);clearInterval(effectNormalInterval);effectInterval=setInterval('convert()',0);break;
		case "statue":clearInterval(effectInterval);clearInterval(effectNormalInterval);effectInterval=setInterval('statue()',0);break;
		case "western":clearInterval(effectInterval);clearInterval(effectNormalInterval);effectInterval=setInterval('western()',0);break;
	
		default:
	}
}

function play(){
	var className=videoPlayer.getAttribute("class");
	if(!className){
		className="notplay";
		videoPlayer.setAttribute("class",className);

	}else{
		if(className.indexOf("not")>=0){
			videoPlayer.play();
			className="play";
			videoPlayer.setAttribute("class",className);
		}else{
			videoPlayer.pause();
			className="notplay";
			videoPlayer.setAttribute("class",className);

		}
	}
	
}
function normal(){
	
	display.drawImage(videoPlayer,0,0,bufferCanvas.width,bufferCanvas.height);


}

function western(){
	
	buffer.drawImage(videoPlayer,0,0,bufferCanvas.width,bufferCanvas.height);
	var vfx=buffer.getImageData(0,0,bufferCanvas.width,bufferCanvas.height);  //cross-origin problem ?
	var length=vfx.data.length/4;

		for (var i = 0; i < length; i++) {
			var r=vfx.data[4*i];
			var g=vfx.data[4*i+1];
			var b=vfx.data[4*i+2];
			var a=vfx.data[4*i+3];
			var gray=parseInt(0.3*r+0.59*g+0.11*b);
			vfx.data[4*i]=gray+80;
			vfx.data[4*i+1]=gray+40;
			vfx.data[4*i+2]=gray-20;
		}
		display.putImageData(vfx,0,0);

}
function gray(){

	// buffer.fillRect(0,0,100,100);
	buffer.drawImage(videoPlayer,0,0,bufferCanvas.width,bufferCanvas.height);
	var vfx=buffer.getImageData(0,0,bufferCanvas.width,bufferCanvas.height);  //cross-origin problem ?
	var length=vfx.data.length/4;

		for (var i = 0; i < length; i++) {
			var r=vfx.data[4*i];
			var g=vfx.data[4*i+1];
			var b=vfx.data[4*i+2];
			var a=vfx.data[4*i+3];
			var gray=parseInt(0.3*r+0.59*g+0.11*b);
			vfx.data[4*i]=gray;
			vfx.data[4*i+1]=gray;
			vfx.data[4*i+2]=gray;
		}
		display.putImageData(vfx,0,0);

}



function black(){
	buffer.drawImage(videoPlayer,0,0,bufferCanvas.width,bufferCanvas.height);
	var vfx=buffer.getImageData(0,0,bufferCanvas.width,bufferCanvas.height);
	var length=vfx.data.length/4;
	for (var i = 0; i < length; i++) {
		var r=vfx.data[4*i];
		var g=vfx.data[4*i+1];
		var b=vfx.data[4*i+2];
		var a=vfx.data[4*i+3];
		var black=parseInt((r+g+b)/3);
		if(black>100)
			black=255;
		else
			black=0;
		vfx.data[4*i]=black;
		vfx.data[4*i+1]=black;
		vfx.data[4*i+2]=black;
	}
	display.putImageData(vfx,0,0);
}

function convert(){
	buffer.drawImage(videoPlayer,0,0,bufferCanvas.width,bufferCanvas.height);
	var vfx=buffer.getImageData(0,0,bufferCanvas.width,bufferCanvas.height);
	var length=vfx.data.length/4;
	for (var i = 0; i < length; i++) {
		var r=vfx.data[4*i];
		var g=vfx.data[4*i+1];
		var b=vfx.data[4*i+2];
		var a=vfx.data[4*i+3];
		vfx.data[4*i]=255-r;
		vfx.data[4*i+1]=255-g;
		vfx.data[4*i+2]=255-b;
	}
	display.putImageData(vfx,0,0);


}

function statue(){
	buffer.drawImage(videoPlayer,0,0,bufferCanvas.width,bufferCanvas.height);
	var vfx=buffer.getImageData(0,0,bufferCanvas.width,bufferCanvas.height);
	var length=vfx.data.length/4;
	for (var i = 0; i < length; i++) {
		var r=vfx.data[4*i];
		var g=vfx.data[4*i+1];
		var b=vfx.data[4*i+2];
		var a=vfx.data[4*i+3];
		if(i==length-1)
			j=0;
		else
			j=i+1;
		var rn=vfx.data[4*j];
		var gn=vfx.data[4*j+1];
		var bn=vfx.data[4*j+2];
		var an=vfx.data[4*j+3];

		vfx.data[4*i]=r-rn+128;
		vfx.data[4*i+1]=g-gn+128;
		vfx.data[4*i+2]=b-bn+128;
	}
	display.putImageData(vfx,0,0);


}