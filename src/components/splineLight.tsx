import Spline from '@splinetool/react-spline';

export default function splineLight() {
  return (
    <div style={{
        width: '650px',
        height: '550px',
        position: 'relative',
        zIndex: 10,
        opacity: 1,
        filter: 'contrast(1) brightness(1)'
      }} className='transform translate-x-3' >
        <Spline scene="https://prod.spline.design/mqpBIyc2zkfDQoUA/scene.splinecode" />
    </div>
    
  );
}