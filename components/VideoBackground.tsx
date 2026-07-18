export default function VideoBackground() {
  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-20"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="fixed inset-0 bg-black/70 -z-10"></div>

      <div className="fixed inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-black -z-10"></div>
    </>
  );
}