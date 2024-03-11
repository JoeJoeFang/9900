const AllEventPage = () => {
    const { listingId } = useParams();
    const [listingStatus, setListingStatus] = useState('pending');
    const [myBooking, setMyBooking] = useState([]);
    // console.log(listingStatus);
    const token = localStorage.getItem('token');
    // listing details info
    const [listingInfo, setListingInfo] = useState({
        title: 'Title',
        address: 'Address',
        amenities: 'Amenities',
        price: 0,
        thumbnails: '',
        type: 'Type',
        reviews: [],
        rating: 0,
        bedroomNum: 0,
        bedNum: 0,
        bathroomNum: 0,
        displayPrice: ' / night' // per night / per stay
    });

    // request listing status
    const getListingStatus = async () => {
        if (!token) return;
        try {
            const response = await axios.get('http://localhost:5005/bookings', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // logged user is the booking owner and current listing is the booking listing
                const bookings = response.data.bookings.filter(booking => booking.owner === localStorage.getItem('userEmail') && booking.listingId.toString() === listingId);
                const updateMyBooking = [];
                bookings.forEach((booking) => {
                    updateMyBooking.push({ id: booking.id, status: booking.status, dateRange: { start: booking.dateRange.start, end: booking.dateRange.end } });
                })
                const item = bookings.find(item => item.status === 'accepted' || item.status === 'denied') || { status: 'pending' };
                setMyBooking([...myBooking, ...updateMyBooking]);
                setListingStatus(item.status);
            }
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    // request listing details info
    const getListingDetails = async () => {
        console.log('getListingDetails', listingId)
        try {
            const response = await axios.get(`http://localhost:5005/listings/${listingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // console.log('viewlisting', response);
                const listing = response.data.listing;
                setListingInfo({
                    ...listingInfo,
                    title: listing.title,
                    address: listing.address,
                    amenities: listing.metadata.amenities,
                    price: parseInt(listing.price, 10),
                    thumbnail: listing.thumbnail,
                    type: listing.metadata.propertyType,
                    reviews: listing.reviews,
                    rating: listing.reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) / listing.reviews.length,
                    bedroomNum: listing.metadata.bedrooms,
                    bedNum: listing.metadata.beds,
                    bathroomNum: listing.metadata.bathrooms,
                    avalibility: listing.avalibility
                });
            }
        } catch (error) {
            alert(error.response.data.error);
        }
    }

    // book component
    const BookDateComponent = ({ price, myBooking, setMyBooking }) => {
        const currDate = new Date();
        const [startDate, setStartDate] = useState(new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), 0, 0, 0, 0
        ));
        const [endDate, setEndDate] = useState(null);

        const book = async () => {
            const days = getDaysDiff(startDate, endDate);
            // console.log(price, startDate);
            if (days == null) return;
            // request new booking
            try {
                console.log(startDate)
                const response = await axios.post(`http://localhost:5005/bookings/new/${listingId}`,
                    { dateRange: { start: startDate, end: endDate }, totalPrice: days * price },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    });
                if (response.status === 200) {
                    console.log('book success', response.data);
                    alert('Book successfully!');
                    setMyBooking([...myBooking, { id: parseInt(response.data.bookingId, 10), status: 'pending', dateRange: { start: startDate.toISOString(), end: endDate.toISOString() } }]);
                }
            } catch (error) {
                console.log(error);
                alert(error.response.data.error);
            }
        }

        return (
            <div>
                <label>Start Date:</label>
                <TextField
                    id="book-start-date"
                    type="date"
                    value={startDate.toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    inputProps={{
                        min: new Date().toISOString().split('T')[0],
                    }}
                />

                <label>End Date:</label>
                <TextField
                    id="book-end-date"
                    type="date"
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    inputProps={{
                        min: new Date().toISOString().split('T')[0],
                    }}
                />
                <Button variant='contained' onClick={book}>Book</Button>
            </div>
        );
    };

    useEffect(() => {
        getListingDetails();
        getListingStatus();
    }, [])

    useEffect(() => {
        getListingDetails();
    }, [listingStatus])

    return (
        <>
            <HostTopNavBar />
            {/* listing details */}
            <div style={{ display: 'flex' }}>
                <div style={{ width: '100%', textAlign: 'center' }}>
          <span>
            <h1 style={{ display: 'inline' }}>{listingInfo.title}</h1>
              {`(${listingStatus})`}
          </span>
                    <p>Address: {listingInfo.address}</p>
                    <p>Amenities: {listingInfo.amenities}</p>
                    <p>$ {listingInfo.price}{listingInfo.displayPrice}</p>
                    {/* {listingInfo.thumbnails.map((thumbnail, index) => (
              <img key={index} src={thumbnail} alt={`Property Image ${index}`} style={{ maxWidth: '100%' }} />
            ))} */}
                    <img key={listingId} src={listingInfo.thumbnail} style={{ maxWidth: '100%' }} />

                    <p>Type: {listingInfo.type}</p>
                    <p>Reviews: {listingInfo.reviews.length}</p>
                    <p>Review Rating: {listingInfo.rating}</p>
                    <p>Number of Bedrooms: {listingInfo.bedroomNum}</p>
                    <p>Number of Beds: {listingInfo.bedNum}</p>
                    <p>Number of Bathrooms: {listingInfo.bathroomNum}</p>
                    {/* Booking section */}
                    <BookDateComponent price={listingInfo.price} myBooking={myBooking} setMyBooking={setMyBooking} />
                </div>
            </div>

            {/* booking history */}
            {token && <BookingHistoryComponent myBooking={myBooking}/>}
            {/* review section */}
            {token && (
                <div style={{ display: 'flex' }}>
                    <ReviewWindow reviews={listingInfo.reviews} listingId={listingId} myBooking={myBooking} />
                </div>
            )}
        </>
    )
};

export default ViewListingPage;