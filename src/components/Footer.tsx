export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="font-semibold text-white">Pokdakan Desa Cibunar © {new Date().getFullYear()}</p>
        <p className="text-sm mt-1 text-gray-400">Pengembang Perikanan Darat Berkualitas & Berkelanjutan</p>
      </div>
    </footer>
  );
}