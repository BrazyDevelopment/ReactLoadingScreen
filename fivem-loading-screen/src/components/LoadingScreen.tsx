import React, { useState, useEffect, useRef } from 'react';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { nuiCallback } from '../lib/nuiCallback';
// Import assets using Vite's asset handling
import song1 from '/assets/song1.mp3';
import song2 from '/assets/song2.mp3';
import song3 from '/assets/song3.mp3';

import logo from '/assets/tmf.svg';
import tmf2Logo from '/assets/tmf2.svg';
import rectangle218 from '/assets/Rectangle 218.svg';
import ellipse9 from '/assets/Ellipse 9.svg';
import rectangle212 from '/assets/Rectangle 212.svg';
import playIcon from '/assets/PlayIcon.svg';
import group39 from '/assets/Group 39.svg';
import discordIcon from '/assets/discord.svg';
import tiktokIcon from '/assets/tiktok.svg';
import storeIcon from '/assets/store.svg';
import previousIcon from '/assets/previous.svg';
import rectangle1353 from '/assets/Rectangle 1353.svg';
import nextSongIcon from '/assets/nextsong.svg';

import videoSource from '/assets/video.mp4';


const SONGS = [song1, song2, song3];

interface UsernameResponse {
  username: string;
}

interface AudioState {
  playing: boolean;
  currentSong: number;
  volume: number;
  isMuted: boolean;
}

const LoadingScreen: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>({
    playing: false,
    currentSong: 0,
    volume: 50,
    isMuted: false,
  });
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [username, setUsername] = useState<string>('Player');
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setAudioState((prev) => ({
      ...prev,
      volume: volumeValue,
      isMuted: volumeValue === 0,
    }));
  
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  useEffect(() => {
    const setupAudio = async () => {
      if (!audioRef.current) return;

      try {
        await audioRef.current.play();
        setAudioState((prev) => ({ ...prev, playing: true }));

        audioRef.current.volume = audioState.isMuted ? 0 : audioState.volume / 100;

        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }

        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        const destination = audioContextRef.current.createMediaStreamDestination();
        sourceNodeRef.current.connect(destination);
        sourceNodeRef.current.connect(audioContextRef.current.destination);

        const recorder = new MediaRecorder(destination.stream);
        setMediaRecorder(recorder);
        recorder.start();
      } catch (error) {
        console.error('Audio setup failed:', error);
        setAudioState((prev) => ({ ...prev, playing: false }));
      }
    };

    videoRef.current?.play();
    setupAudio();

    return cleanupAudio;
  }, [audioState.volume, audioState.isMuted]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const result = await nuiCallback<{}, UsernameResponse>('/getUsername', {});
        if (result && typeof result.username === 'string') {
          setUsername(result.username);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      
      // Handle FiveM NUI messages
      if (data.type === 'updateLoadingProgress') {
        setLoadingProgress(data.progress);
        setLoadingStage(data.stage);
      }
      
      if (data.type === 'loadingComplete') {
        setTimeout(() => {
          setIsVisible(false);
        }, 1000); // Fade out after loading complete
      }
    };

    fetchUsername();
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioState.isMuted ? 0 : audioState.volume / 100;
      audioState.playing ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [audioState]);

  const cleanupAudio = () => {
    mediaRecorder?.stop();
  };

  const handleFadeOutComplete = () => {
    if (!isVisible) {
      // Notify FiveM that loading is complete
      nuiCallback('/loadingScreenComplete', {}).catch(console.error);
    }
  };

  const toggleAudio = () => setAudioState((prev) => ({ ...prev, playing: !prev.playing }));

  const changeSong = (direction: 'next' | 'prev') => {
    setAudioState((prev) => ({
      ...prev,
      currentSong: (prev.currentSong + (direction === 'next' ? 1 : -1) + SONGS.length) % SONGS.length,
      playing: true,
    }));
  };

  const toggleMute = () => {
    setAudioState((prev) => {
      const newVolume = prev.isMuted ? 50 : 0; 
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
      }
      return {
        ...prev,
        isMuted: !prev.isMuted,
        volume: newVolume,
      };
    });
  };

  if (!isVisible) return null;

  return (
    <div
      className={`text-neutral-content relative h-screen w-screen overflow-hidden bg-black transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onTransitionEnd={() => !isVisible && handleFadeOutComplete()}
    >
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={videoSource}
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
        />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-between p-8 bg-black bg-opacity-50">
        <Header username={username} volume={audioState.volume} onVolumeChange={handleVolumeChange} onMuteToggle={toggleMute} />
        <MainContent />
        <Footer
          audioState={audioState}
          mediaRecorder={mediaRecorder}
          onToggleAudio={toggleAudio}
          onChangeSong={changeSong}
          loadingProgress={loadingProgress}
          loadingStage={loadingStage}
        />
      </div>
      <audio
        ref={audioRef}
        src={SONGS[audioState.currentSong]}
        onEnded={() => changeSong('next')}
        autoPlay
      />
    </div>
  );
};

interface HeaderProps {
  username: string;
  volume: number;
  onVolumeChange: (newVolume: number[]) => void;
  onMuteToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, volume, onVolumeChange, onMuteToggle }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4 -mt-4">
      <img src={logo} alt="Server Logo" className="h-16" />
      <img src={rectangle218} alt="Some Image" />
      <h1 className="text-md text-white">Welcome, {username || 'Player'}!</h1>
    </div>
    <div className="flex items-center space-x-2">
      <Slider
        value={[volume]}
        onValueChange={onVolumeChange}
        max={100}
        step={1}
        className="w-32"
      />
      <button type="button" className="relative" onClick={onMuteToggle}>
        <img src={ellipse9} className="w-full" />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black">
          {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </span>
      </button>
    </div>
  </div>
);

const MainContent: React.FC = () => (
  <>
    <div className="flex justify-between">
      <div className="flex flex-row items-start">
        <div className="relative flex flex-row my-4">
          <img src={rectangle212} className="w-full" />
          <img
            src={playIcon}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6"
          />
        </div>
        <div className="pt-4 pl-4">
          <img src={group39} />
        </div>
      </div>
    </div>
    <div className="flex justify-between">
      <div className="text-start text-white max-w-sm mb-4">
        <p>Amet nulia eget uma viverra sit adipiscing locus sed varius. Adipiscing nulia vulputat.</p>
      </div>
    </div>
    <div className="flex flex-col items-start">
      <div className="flex flex-row space-x-4 mt-4 -mb-20">
        <a href="https://discord.gg/tmfrz">
          <button type="button">
            <img src={discordIcon} alt="Discord" />
          </button>
        </a>
        <a href="https://tiktok.com/@tmfrz">
          <button type="button">
            <img src={tiktokIcon} alt="TikTok" />
          </button>
        </a>
        <a href="https://tmfrz.tebex.io">
          <button type="button">
            <img src={storeIcon} alt="Store" />
          </button>
        </a>
      </div>
    </div>
    <div className="flex-grow flex flex-col justify-center items-center">
      <div className="max-w-screen object-center items-center justify-center justify-items-center mt-24 -mb-20">
        <img src={tmf2Logo} alt="Server Logo" />
      </div>
      <div className="text-center text-white text-lg max-w-md pb-8 pl-2">
        <p>Enim bibendum cursus non sagittis malesuada mollis. A amet fuegiat amet tempus. Erat consequat ut mauris vel non elit.</p>
      </div>
    </div>
  </>
);

interface FooterProps {
  audioState: AudioState;
  mediaRecorder: MediaRecorder | null;
  onToggleAudio: () => void;
  onChangeSong: (direction: 'next' | 'prev') => void;
  loadingProgress: number;
  loadingStage: string;
}

const Footer: React.FC<FooterProps> = ({ audioState, mediaRecorder, onToggleAudio, onChangeSong, loadingProgress, loadingStage }) => (
  <>
    <div className="w-full flex flex-col items-center justify-center">
      {mediaRecorder && mediaRecorder.state === 'recording' && (
        <div style={{ border: 'none', padding: '10px', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <LiveAudioVisualizer
            mediaRecorder={mediaRecorder}
            width={300}
            height={80}
            barWidth={1}
            gap={2}
            barColor="#ff0000"
            backgroundColor="transparent"
          />
        </div>
      )}
    </div>
    <div className="flex justify-center mt-4">
      <button type="button" onClick={() => onChangeSong('prev')}>
        <img src={previousIcon} alt="Previous" />
      </button>
      <button type="button" className="relative" onClick={onToggleAudio}>
        <img src={rectangle1353} className="w-full" alt="Play/Pause background" />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black">
          {audioState.playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </span>
      </button>
      <button type="button" onClick={() => onChangeSong('next')}>
        <img src={nextSongIcon} alt="Next" />
      </button>
    </div>
    <div className="px-8">
      <div className="flex justify-between items-center mb-2">
        <p className="text-white font-semibold text-lg">{loadingStage}</p>
        <p className="text-white text-center text-lg mt-2 font-bold">{loadingProgress}%</p>
      </div>
      <div className="w-full mb-4">
        <Progress value={loadingProgress} className="w-full" />
      </div>
    </div>
  </>
);

export default LoadingScreen;
