import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './styles/ScrollArrow.css';

export default function ScrollArrow() {
  const [isTargetInView, setIsTargetInView] = useState(true);

  useEffect(() => {
    const targetElement = document.getElementById('service-container');
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTargetInView(entry.isIntersecting);
      },
      {
        threshold: 0.1
      }
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleClick = () => {
    if (!isTargetInView) {
      const element = document.getElementById('services');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <IconButton
      onClick={handleClick}
      className="homepage-scroll-arrow"
      sx={{
        opacity: isTargetInView ? 0 : 1,
        ':hover': {
          cursor: isTargetInView ? 'auto' : 'pointer'
        }
      }}
    >
      <KeyboardArrowDownIcon sx={{ fontSize: '3rem' }} />
    </IconButton>
  );
};
