import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const imageUrl = `http://localhost:5000/uploads/${listing.imageFileNames?.[0] || listing.imageFileName}`;
  const isLowStock = listing.availableRooms <= 3 && listing.availableRooms > 0;
  const isSoldOut = listing.availableRooms === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      {isLowStock && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
          Tinggal {listing.availableRooms} kamar!
        </div>
      )}
      {isSoldOut && (
        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold z-10">
          PENUH
        </div>
      )}
      <div className="relative">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        {listing.imageFileNames && listing.imageFileNames.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
            +{listing.imageFileNames.length - 1} foto
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{listing.title}</h3>
        <p className="text-gray-600 text-sm mt-1 truncate">{listing.location}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-teal-600 font-bold">
            Rp {listing.price.toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-gray-500">
            {listing.availableRooms || 0} / {listing.totalRooms || 0} kamar
          </p>
        </div>
        <Link
          to={`/listing/${listing._id}`}
          className="block mt-4 text-center bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ListingCard;
