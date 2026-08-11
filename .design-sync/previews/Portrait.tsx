import { Portrait } from '@aiaru/site-ds';
import homePhoto from '../../images/DSC07091.jpg';
import storyPhoto from '../../images/DSC06855_2.webp';

export const Home = () => <Portrait variant="home" src={homePhoto} alt="Aiaru" />;
export const Story = () => <Portrait variant="story" src={storyPhoto} alt="Aiaru in San Francisco" />;
