var trabajos = (function(document){

    //Controles Vídeo
    function playVideo(){
        var video = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('video');
        video[0].classList.toggle('video-play');
        video[0].play();
    }

    function pauseVideo(){
        var video = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('video');
        video[0].pause();
        video[0].classList.toggle('video-play');
    }

    function stopVideo(){
        var video = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('video');
        video[0].pause();
        video[0].currentTime = 0;
        video[0].classList.toggle('video-play');
    }

    function backwardVideo(){
        var video = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('video');
        video[0].currentTime = video[0].currentTime - 2;
    }

    function forwardVideo(){
        var video = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('video');
        video[0].currentTime = video[0].currentTime + 2;
    }

    function fullscreenVideo(){
        this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('video')[0].requestFullscreen();
    }

    function updateTimeVideo(event){
        var timeDiv = event.target.parentNode.querySelector(".tiempo-video");

        var progressBar = event.target.parentNode.querySelector(".progress-bar");
        var progressNumber = event.target.parentNode.querySelector(".progress-number");
        var progress = event.target.currentTime * 100 / event.target.duration;

        // Display video time 00:00 / 01:30 format
        timeDiv.innerText = getMediaDurationString(event.target.currentTime) + "/" + getMediaDurationString(event.target.duration);
        progressNumber.innerText = (Math.round(progress * 100) / 100) + "%";

        progressBar.style.width = progress + "%";
    }

    function changeVolumeVideo(event) {
        var video = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("video");
        video.volume = event.target.value / 100;
    }

    function muteVideo(event) {
      var video = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("video");
      var volumebar = event.target.parentNode.parentNode.querySelector('.volume');

      if (video.muted)
      {
          video.muted = false;
          volumebar.value = video.volume * 100;
      } else {
          video.muted = true;
          volumebar.value = 0;
      }

      event.target.classList.toggle('fa-volume-up');
      event.target.classList.toggle('fa-volume-mute');
    }

    function switchVideoStatus(){
        if(this.paused){
            this.play();
            this.classList.toggle('video-play');
        }
        else{
            this.pause();
            this.classList.toggle('video-play');
        }
    }
    // Información del vídeo en un formato adecuado
    function getMediaDurationString(duration) {
      var mins,
          secs;

      secs = duration % 60;
      mins = (duration - secs) / 60;

      secs = Math.ceil(secs);

      mins = addLeadingZeros(mins);
      secs = addLeadingZeros(secs);

      return "  " + mins + ":" + secs;
    }

    function addLeadingZeros(num) {
      num = num.toString();

      while (num.length < 2) {
        num = "0" + num;
      }

      return num;
    }

    var controles_video = document.getElementsByClassName("controles-video");
    for(var i = 0; i < controles_video.length; i++)
    {
        controles_video[i].querySelector('i.fa-play').addEventListener('click', playVideo);
        controles_video[i].querySelector('i.fa-pause').addEventListener('click', pauseVideo);
        controles_video[i].querySelector('i.fa-stop').addEventListener('click', stopVideo);
        controles_video[i].querySelector('i.fa-backward').addEventListener('click', backwardVideo);
        controles_video[i].querySelector('i.fa-forward').addEventListener('click', forwardVideo);
        controles_video[i].querySelector('i.fa-expand-arrows-alt').addEventListener('click', fullscreenVideo);
    }

    // Event Listeners de los vídeos
    var video_elements = document.getElementsByTagName('video');
    for(var j = 0; j < controles_video.length; j++)
    {
        video_elements[j].addEventListener('click', switchVideoStatus);
        video_elements[j].addEventListener('timeupdate', updateTimeVideo);
    }

    var volumenes = document.querySelectorAll("input.volume");
    var mutes = document.querySelectorAll(".control-mute i");

    for (var i = 0; i < volumenes.length; i++) {
      volumenes[i].addEventListener('change', changeVolumeVideo);
      mutes[i].addEventListener("click", muteVideo);
    }
    function removeAudioPlaying()
    {
        var audios_repr = document.getElementsByTagName("audio");
        for(var i = 0; i < audios_repr.length; i++){
            audios_repr[i].remove();
        }
        
        //Desactivamos todos los botones que pudieran estar activos
        var botones_actv = document.getElementsByClassName('audio-activo');
        for(i = 0; i < botones_actv.length; i++){
            botones_actv[i].classList.remove('audio-activo');
        }
    }

    //Cargar Audio
    function loadAudio(){      
        
        removeAudioPlaying();

        //Marcamos el audio actual como activo
        this.classList.toggle('audio-activo');

        //Cargamos la nueva pista de Audio
        var nombre_audio = "assets/audios/" + this.name + ".mp3";
        var audio = new Audio(nombre_audio);
        audio.style.width = "100%";
        audio.volume = 0.15;
        audio.controls = 'controls';

        audio.addEventListener('timeupdate', updateTimeAudio);
        
        //Insertamos información
        var divAudio = document.getElementById("div-audio");
        divAudio.appendChild(audio);

        var nombreAudio = document.getElementById('nombre-audio');
        nombreAudio.innerText = this.name;

        audio.play();
    }
    function updateTimeAudio(event){
        var timeDiv = document.getElementById("tiempo-audio");
        timeDiv.innerText = getMediaDurationString(event.target.currentTime) + " / " + getMediaDurationString(event.target.duration);

        var stateDiv = document.getElementById("estado-audio");
        stateDiv.innerText = AudioState(event.target);
    }

    function AudioState(audio)
    {
        if(audio.ended)
            return "Finalizado";
        else if (audio.paused)
            return "Pausado";
        else
            return "Reproduciendo";
    }

    var audio1 = document.getElementById("audio1");
    var audio2 = document.getElementById("audio2");
    var audio3 = document.getElementById("audio3");
    audio1.addEventListener('click', loadAudio);
    audio2.addEventListener('click', loadAudio);
    audio3.addEventListener('click', loadAudio);

    //Animación Hover Secondary Nav
    function navAnimationIN(){
        this.classList.add('animate__pulse');
    }
    function navAnimationOUT(){
        this.classList.remove('animate__pulse');
    }
    var secondary_nav = document.getElementsByClassName('secondary-nav');
    var lis = secondary_nav[0].getElementsByTagName('li');
    for(var z = 0; z < lis.length; z++) {
        lis[z].addEventListener('mouseover', navAnimationIN);
        lis[z].addEventListener('mouseleave', navAnimationOUT);
    }

    //Animación Hover cards
    function arrowAnimation() {
        this.querySelector('i.fa-long-arrow-alt-right').classList.add('animate__fadeInLeft');
    }
    function arrowAnimationOut(){
        this.querySelector('i.fa-long-arrow-alt-right').classList.remove('animate__fadeInLeft');
    }
    var card_elements = document.getElementsByClassName('card');
    for (var i = 0; i < card_elements.length; i++)
    {
        card_elements[i].addEventListener('mouseover', arrowAnimation);
        card_elements[i].addEventListener('mouseleave', arrowAnimationOut);
    }

    //Parar la reproducción multimedia cuando los 'MODALS' se cierran
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++)
        modals[i].addEventListener('hidden.bs.modal', stopModalMultimedia);

    function stopModalMultimedia(event){

      var video = event.target.querySelector('video');
      var iframe = event.target.querySelector('iframe');
      var estadoAudio = document.getElementById("estado-audio");
      
      if (video){
        video.pause();
        video.currentTime = 0;
        video.classList.toggle('video-play');
      }
      else if (iframe){
        var iframeSrc = iframe.src;
		iframe.src = iframeSrc;
      }
      else{
        removeAudioPlaying();
        estadoAudio.innerText = "";
      }

    }
    // Se puede devolver un objeto con funciones / atributos
    return {
    };
})(document);
