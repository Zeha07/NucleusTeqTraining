import React, { useEffect, useState } from 'react';
import './Review.css'; // Make sure to create this CSS file

export default function SingleReview({ singlereviewdata, showsinglereview, setshowsinglereview, user, refreshReviewData }) {
  const [img, setImg] = useState(null);
  const [approve, setApprove] = useState(false);
  const [comment, setComment] = useState(" ");
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  useEffect(() => {
    if (singlereviewdata.rid) {
      const fetchImage = async () => {
        const form = new FormData();
        form.append("id", singlereviewdata.rid);
        
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
  }, [singlereviewdata.rid]);

  useEffect(() => {
    if (approve || (!approve && comment.trim().length > 0)) {
      setIsSaveEnabled(true);
    } else {
      setIsSaveEnabled(false);
    }
  }, [approve, comment]);

  const handleApprove = () => {
    setApprove(true);
  };

  const handleReject = () => {
    setApprove(false);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSave = async () => {
    // Implement save logic here
    console.log('Saving decision:', approve ? 'Approved' : 'Rejected');
    console.log('Comment:', comment);
    try {
      const form = new FormData();
      form.append("rid", singlereviewdata.rid);
      form.append("appr_m", user.empid);
      form.append("status", approve);
      form.append("comment", comment);

      const res = await fetch('http://localhost:8000/reviewapprove', {
        method: "PUT",
        body: form
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const msg = await res.json();
      alert(msg.message);

      // Refresh review data after saving
      refreshReviewData();
    } catch (error) {
      console.error('Error saving review:', error);
    }
    setshowsinglereview(false);
  };

  return (
    <div className='SeeAll-container'>
      <div className='see-all'>
        <span>Claim Details</span>
      </div>

      <div className='single-review-body'>
        <div className='review-item'>
          <span className='review-label'>Employee Name:</span>
          <span className='review-value'>{singlereviewdata.empusername}</span>
        </div>
        <div className='review-item'>
          <span className='review-label'>Type:</span>
          <span className='review-value'>{singlereviewdata.type}</span>
        </div>
        <div className='review-item'>
          <span className='review-label'>Amount:</span>
          <span className='review-value'>{singlereviewdata.amt}</span>
        </div>
        <div className='review-item'>
          <span className='review-label'>Date:</span>
          <span className='review-value'>{singlereviewdata.date}</span>
        </div>
        <div className='review-item'>
          <span className='review-label'>Receipt Image:</span>
          {img && <img src={img} alt="Uploaded" className='review-image' />}
        </div>
        <div className='review-item'>
          <span className='review-label'>Enter Comment:</span>
          <input type="text" placeholder="Enter comment" value={comment} onChange={handleCommentChange} />
        </div>
        <div className='review-actions'>
          <button className="review-button" onClick={() => setshowsinglereview(false)}>
            <span className="button__text">Back</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>
          <button className="review-button" onClick={handleApprove}>
            <span className="button__text">Approve</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>
          <button className="review-button" onClick={handleReject}>
            <span className="button__text">Reject</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>
          <button className="review-button" onClick={handleSave} disabled={!isSaveEnabled}>
            <span className="button__text">Save</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
