document.addEventListener('DOMContentLoaded', function () {
  const AudioPlayers = document.querySelectorAll('.custom-audio-player');
  let SavedVolume = localStorage.getItem('audioVolume') || 1;
  
  AudioPlayers.forEach(function (PlayerContainer) {
    const Audio = PlayerContainer.nextElementSibling;
    const AudioSource = Audio.querySelector("source").src;
    const Filename = AudioSource.split("/").pop();
    console.log('Initializing audio player:', Filename);
    if (!Audio || Audio.tagName !== 'AUDIO') {
      console.error('Audio element not found or incorrect tag for custom player container:', Filename);
      return;
    }

    const SeekSlider = PlayerContainer.querySelector('.seek-slider');
    const VolumeSlider = PlayerContainer.querySelector('.volume-slider');
    const CurrentTimeElem = PlayerContainer.querySelector('.current-time');
    const TotalTimeElem = PlayerContainer.querySelector('.total-time');
    const PlayPauseButton = PlayerContainer.querySelector('.play-pause-button');
    const DownloadButton = PlayerContainer.querySelector('.download-button');
      
    Audio.volume = SavedVolume;
    if (VolumeSlider) {
      VolumeSlider.value = SavedVolume;
    }

    if (SeekSlider) {
      Audio.addEventListener('timeupdate', function () {
        SeekSlider.value = (Audio.currentTime / Audio.duration) * 100;
        if (CurrentTimeElem) {
          CurrentTimeElem.textContent = FormatTime(Audio.currentTime);
        }
      });

      SeekSlider.addEventListener('input', function () {
        Audio.currentTime = (SeekSlider.value / 100) * Audio.duration;
        Update();
      });
    }

    Audio.addEventListener('loadedmetadata', function () {
      if (TotalTimeElem) {
        TotalTimeElem.textContent = FormatTime(Audio.duration);
      }
      Update();
    });

    if (VolumeSlider) {
      VolumeSlider.addEventListener('input', function () {
        const NewVolume = parseFloat(VolumeSlider.value);
        AudioPlayers.forEach(function (PlayerContainer) {
          const Audio = PlayerContainer.nextElementSibling;
          if (Audio && Audio.tagName === 'AUDIO') {
            ChangeVolume(Audio, NewVolume, 100);
          }
          const VolumeSlider = PlayerContainer.querySelector('.volume-slider');
          if (VolumeSlider) VolumeSlider.value = NewVolume;
        });
        localStorage.setItem('audioVolume', NewVolume);
      });      
    }

    PlayPauseButton.addEventListener('click', () => {
      console.log('Button clicked, activating:', Filename);
      if (Audio.paused) {
        Audio.play();
        PlayPauseButton.textContent = 'Pause';
        Update();
      } else {
        Audio.pause();
        PlayPauseButton.textContent = 'Play';
        Update();
      }
    });

    Audio.addEventListener('ended', () => {
      PlayPauseButton.textContent = 'Play';
      Update();
    });

    if (DownloadButton) {
      DownloadButton.addEventListener("click", () => {
        const AudioSrc = Audio.querySelector("source").src;
        const Fname = AudioSrc.split("/").pop();
        if (AudioSrc) {
          console.log('Download button clicked, downloading:', Fname);
          fetch(AudioSrc)
            .then(response => response.blob())
            .then(blob => {
              const Url = URL.createObjectURL(blob);
              const Link = document.createElement("a");
              Link.href = Url;
              Link.download = Fname;
              document.body.appendChild(Link);
              Link.click();
              document.body.removeChild(Link);
              URL.revokeObjectURL(Url);
              console.log("Download completed for:", Fname);
            })
            .catch(error => console.error("Download error:", error));
        }
      });
    }

    function Update() {
      if (!SeekSlider || !VolumeSlider) return;
      const SeekRect = SeekSlider.getBoundingClientRect();
      const PlayerRect = PlayerContainer.getBoundingClientRect();
      const OffsetLeft = SeekRect.left - PlayerRect.left;
      VolumeSlider.style.left = `${OffsetLeft}px`;
    }

    function FormatTime(time) {
      const Minutes = Math.floor(time / 60);
      const Seconds = Math.floor(time % 60);
      return `${Minutes}:${Seconds < 10 ? '0' : ''}${Seconds}`;
    }
  });

  
  function ChangeVolume(audioElement, targetVolume, duration = 100) {
    const volume = audioElement.volume;
    let step = 0;
  
    const intervalId = setInterval(() => {
      step++;
      audioElement.volume = volume + (targetVolume - volume) / 25 * step;
      if (step >= 25) {
        clearInterval(intervalId);
      }
    }, duration / 25);
  }
});