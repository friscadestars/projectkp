const SearchInput = ({ placeholder = "Cari Order ID", value = "", onChange }) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`border border-gray-400 px-3 py-2 rounded text-sm ${value ? 'text-black' : 'text-gray-400'} w-full max-w-[150px]`}
            />
        </div>
    );
};


export default SearchInput;
