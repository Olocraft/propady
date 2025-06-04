export default function Footer() {
  return (
    <footer className="py-6 bg-black">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-propady-mint rounded-lg"></div>
            <span className="relative text-black font-bold text-lg">P</span>
          </div>
          <span className="text-white font-bold">Propady</span>
        </div>
        <div className="text-white/60 text-sm">© 2024 Propady</div>
      </div>
    </footer>
  );
}
