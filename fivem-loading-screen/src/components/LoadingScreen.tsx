import React, { useState, useEffect, useRef } from 'react';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Volume2, VolumeX } from 'lucide-react';
import { FaPlay, FaStop  } from "react-icons/fa";
import { LiveAudioVisualizer } from 'react-audio-visualize';
import song1 from '/assets/song1.mp3';
import song2 from '/assets/song2.mp3';
import song3 from '/assets/song3.mp3';
import logo from '/assets/tmf.svg';
import tmf2Logo from '/assets/tmf2.svg';
import rectangle218 from '/assets/Rectangle218.svg';
import ellipse9 from '/assets/Ellipse9.svg';
import rectangle212 from '/assets/Rectangle212.svg';
import playIcon from '/assets/PlayIcon.svg';
import group39 from '/assets/Group39.svg';
import discordIcon from '/assets/discord.svg';
import tiktokIcon from '/assets/tiktok.svg';
import storeIcon from '/assets/store.svg';
import previousIcon from '/assets/previous.svg';
import rectangle1353 from '/assets/Rectangle1353.svg';
import nextSongIcon from '/assets/nextsong.svg';
import imageBackground from '/assets/background-image.png';



const SONGS = [song1, song2, song3];
interface LoadingScreenProps {
  onLoadComplete?: () => void;
}

interface AudioState {
  playing: boolean;
  currentSong: number;
  volume: number;
  isMuted: boolean;
}

interface LoadingState {
  progress: number;
  stage: string;
  isVisible: boolean;
}

interface ButtonData {
  url: string;
  icon: string;
  alt: string;
}

const SocialButtons: React.FC = () => {
  const openInNewWindow = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const buttons: ButtonData[] = [
    {
      url: 'https://discord.gg/tmfrz',
      icon: discordIcon,
      alt: 'Discord'
    },
    {
      url: 'https://tiktok.com/@tmfrz',
      icon: tiktokIcon,
      alt: 'TikTok'
    },
    {
      url: 'https://tmfrz.tebex.io',
      icon: storeIcon,
      alt: 'Store'
    }
  ];
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-row space-x-4 mt-4 -mb-20">
        {buttons.map((button: ButtonData, index: number) => (
          <button
            key={index}
            type="button"
            onClick={() => openInNewWindow(button.url)}
            className="z-[9999]"
          >
            <img 
              src={button.icon} 
              alt={button.alt} 
              className="w-20 h-20"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadComplete }) => {
  const [audioState, setAudioState] = useState<AudioState>({
    playing: true,
    currentSong: 0,
    volume: 50,
    isMuted: false,
  });

  const [loadingState, setLoadingState] = useState<LoadingState>({
    progress: 0,
    stage: 'Initializing...',
    isVisible: true,
  });

  const [username, setUsername] = useState<string>('Player');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;

      if (data.type === 'setPlayerName') {
        setUsername(data.name);
      }

      if (data.eventName === 'loadProgress') {
        const progress = Math.floor(data.loadFraction * 100);
        setLoadingState(prev => ({
          ...prev,
          progress,
          stage: getLoadingStage(progress)
        }));
      }

      if (data.type === 'loadingComplete') {
        handleLoadingComplete();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const getLoadingStage = (progress: number): string => {
    if (progress < 20) return 'Initializing...';
    if (progress < 40) return 'Loading Game Files...';
    if (progress < 60) return 'Establishing Connection...';
    if (progress < 80) return 'Loading World...';
    return 'Finalizing...';
  };

  const handleLoadingComplete = () => {
    console.log("Loading complete!");
    setLoadingState(prev => ({ ...prev, isVisible: false }));

    fetch('nui://tmf-loadingscreen/loadingScreenDone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loaded: true })
    })
      .then(() => {
        onLoadComplete?.();
      })
      .catch(console.error);
  };

  const cleanupAudio = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null); 
    }
  
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null; 
    }
  
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null; 
    }
  };
  
  const playSong = (songUrl: string) => {
    cleanupAudio(); 
  
    audioRef.current = new Audio(songUrl);
    audioContextRef.current = new AudioContext();
    const sourceNode = audioContextRef.current.createMediaElementSource(audioRef.current);
    const mediaStreamDestination = audioContextRef.current.createMediaStreamDestination();
  
    sourceNode.connect(mediaStreamDestination);
    sourceNode.connect(audioContextRef.current.destination);
  
    audioRef.current.volume = audioState.volume / 100;
    audioRef.current.loop = true;
    audioRef.current.play().catch((error) => console.error("Playback failed:", error));
  
    const newMediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
    setMediaRecorder(newMediaRecorder);
  
    newMediaRecorder.ondataavailable = (event) => {
      console.log(event.data);
    };
    newMediaRecorder.onstart = () => {
      console.log("Recording started");
    };
    newMediaRecorder.onstop = () => {
      console.log("Recording stopped");
    };
  
    newMediaRecorder.start();
  };


  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setAudioState(prev => ({
      ...prev,
      volume: volumeValue,
      isMuted: volumeValue === 0,
    }));

    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  const toggleAudio = () => {
    if (audioState.playing) {
      cleanupAudio();
    } else {
      playSong(SONGS[audioState.currentSong]);
    }
    setAudioState(prev => ({ ...prev, playing: !prev.playing }));
  };

  const changeSong = (direction: 'next' | 'prev') => {
    const newIndex = (audioState.currentSong + (direction === 'next' ? 1 : -1) + SONGS.length) % SONGS.length;
    setAudioState(prev => ({
      ...prev,
      currentSong: newIndex,
      playing: true,
    }));
    playSong(SONGS[newIndex]);
  };

  const toggleMute = () => {
    setAudioState(prev => {
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

  useEffect(() => {
    if (!loadingState.isVisible) {
      cleanupAudio(); 
      setAudioState({
        playing: false,
        currentSong: 0,
        volume: 50,
        isMuted: false,
      });
    }
  }, [loadingState.isVisible]);

  useEffect(() => {
    if (audioState.playing) {
      playSong(SONGS[audioState.currentSong]);
    }
  }, []);

  return (
    <div
      className={`text-neutral-content relative h-screen w-screen overflow-hidden bg-black transition-opacity duration-1000 ${loadingState.isVisible ? 'visible' : 'hidden'}`}
      onTransitionEnd={() => {
        if (!loadingState.isVisible) {
          handleLoadingComplete();
        }
      }}
    >
      <div className="absolute inset-0">
        <img src={imageBackground} alt="Background" className="absolute w-full h-full object-cover" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between p-8 bg-black bg-opacity-50">
        <Header 
          username={username} 
          volume={audioState.volume} 
          onVolumeChange={handleVolumeChange} 
          onMuteToggle={toggleMute} 
        />
        
        <MainContent />
        
        <Footer
          audioState={audioState}
          mediaRecorder={mediaRecorder}
          onToggleAudio={toggleAudio}
          onChangeSong={changeSong}
          loadingProgress={loadingState.progress}
          loadingStage={loadingState.stage}
        />
      </div>
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
  <div className="flex items-start justify-between">
    <div className="flex items-center space-x-4 -mt-4">
      <img src={logo} alt="Server Logo" className="h-16 -ml-1" />
      <img src={rectangle218} alt="Some Image" />
      <h1 className="text-md text-white">Welcome, {username}!</h1>
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
        <div className="relative flex flex-row my-6">
          <img src={rectangle212} className="w-full" />
          <img
            src={playIcon}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6"
          />
        </div>
        <div className="pt-6 pl-4">
          <img src={group39} />
        </div>
      </div>
    </div>
    <div className="flex justify-between">
      <div className="text-start text-white max-w-sm mb-4">
        <p>Amet nulia eget uma viverra sit adipiscing locus sed varius. Adipiscing nulia vulputat.</p>
      </div>
    </div>
    <SocialButtons />
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
      {mediaRecorder && (
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
    <div className="flex justify-center mt-4 space-x-2">
      <button type="button" onClick={() => onChangeSong('prev')}>
        <img src={previousIcon} alt="Previous" />
      </button>
      <button type="button" className="relative" onClick={onToggleAudio}>
        <img src={rectangle1353} className="w-full" alt="Play/Pause background" />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black">
        {audioState.playing ? <FaStop className="w-3 h-3" /> : <FaPlay className="w-3 h-3" />}
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