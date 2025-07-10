const SearchInput = ({ placeholder = "Cari", onChange }) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder={placeholder}
                onChange={onChange}
                className="w-1/5 px-2 py-2 border border-gray-300 rounded-md text-sm"
            />
        </div>
    );
};

export default SearchInput;
