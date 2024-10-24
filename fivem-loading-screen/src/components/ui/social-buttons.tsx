import discordIcon from '/assets/discord.svg';
import tiktokIcon from '/assets/tiktok.svg';
import storeIcon from '/assets/store.svg';

interface ButtonData {
    url: string;
    icon: string;
    alt: string;
  }
  
  const SocialButtons: React.FC = () => {
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
            <a 
              key={index}
              href={button.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="z-[9999] block"
            >
              <img 
                src={button.icon} 
                alt={button.alt} 
                className="w-20 h-20 cursor-pointer"
              />
            </a>
          ))}
        </div>
      </div>
    );
  };


  export default SocialButtons;