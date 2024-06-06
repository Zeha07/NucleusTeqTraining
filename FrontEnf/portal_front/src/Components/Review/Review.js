import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import SingleReview from './SingleReview';
export default function Review({ reviewdata, user, handlesinglereviewchange ,singlereviewdata, showsinglereview, setshowsinglereview }) {
    const btn1 = {
        backgroundColor: '#007BFF',
        color: 'white',
        borderRadius: '5px',
        padding: '0px 20px',
        height: '35px',
        aligncontent: 'centre',
        margin: '10px',
        transition: 'transform 0.3s ease',
    };

    return (
        <div className='Review-container'>
            <div className='reviewtable-responsive'>
                <table className='reviewtable table-bordered table-hover'>
                    <thead >
                        <tr >
                            <th>Sr.</th>
                            <th>Employee</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody >
                        {reviewdata.length > 0 ? (
                            reviewdata.map((review, index) => (
                                <tr >
                                    <td>{index + 1}</td>
                                    <td>{review.empusername}</td>
                                    <td>{review.type}</td>
                                    <td>{review.amt}</td>
                                    <td>{review.date}</td>
                                    <td><button onClick={() => handlesinglereviewchange(review)}>See Details</button></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* {showsinglereview && <SingleReview singlereviewdata={singlereviewdata} showsinglereview={showsinglereview} setshowsinglereview={setshowsinglereview} />} */}

        </div>
    );
}
