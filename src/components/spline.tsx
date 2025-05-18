import Spline from '@splinetool/react-spline';

export default function spline() {
  return (
    <div style={{
      width: '650px',
      height: '550px',
      position: 'relative',
      zIndex: 10,
      opacity: 1,
      filter: 'contrast(1.1) brightness(2)'
    }} className='transform translate-x-3'>
      <Spline scene="https://prod.spline.design/bDyxXGUprsX4UP-Q/scene.splinecode" />
    </div>
  );
}