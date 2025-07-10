const ValidasiActions = ({ handleTerima, handleTolak }) => (
    <div className="mt-6 flex gap-4">
        <button
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-1 rounded font-bold"
            onClick={handleTerima}
        >
            Terima
        </button>
        <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-1 rounded font-bold"
            onClick={handleTolak}
        >
            Tolak
        </button>
    </div>
);

export default ValidasiActions;
