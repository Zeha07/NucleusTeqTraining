import React, { useEffect, useState } from 'react';
import './Claimtable.css'; // Make sure to create this CSS file

export default function SingleReview({ showdetailsdata, showdetails, setshowdetails, refreshReviewData }) {
  const [img, setImg] = useState(null);
  const [approve, setApprove] = useState(false);
  const [comment, setComment] = useState(" ");
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  useEffect(() => {
    if (showdetailsdata.rid) {
      const fetchImage = async () => {
        const form = new FormData();
        form.append("id", showdetailsdata.rid);
        
        try {
          const response = await fetch('http://localhost:8000/get_image', {
            method: "POST",
            body: form,
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          setImg(`data:image/jpeg;base64,${data.img}`);
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      };

      fetchImage();
    }
  }, [showdetailsdata.rid]);

  
  


   
  return (
    <div className='SeeAll-container'>
      <div className='see-all'>
        <span>Claim Details</span>
      </div>

     <div className='single-review-body'>
       
        <div className='review-item'>
          <span className='review-label'>Receipt Image:</span>
          {img && <img src={img} alt="Uploaded" className='review-image' />}
        </div>
        
        <div className='review-actions'>
          <button className="review-button" onClick={() => setshowdetails(false)}>
            <span className="button__text">Back</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>
          
          
         
        </div>
      </div> 
    </div>
  );
}
