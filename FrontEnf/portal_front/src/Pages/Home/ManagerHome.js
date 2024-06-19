import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header.js';
import Claimnew from '../../Components/Claimnew/Claimnew.js';
import './Home.css';
import SeeAll from '../../Components/SeeAll/SeeAll.js';
import Claimtable from '../../Components/Claimtable/Claimtable.js';
import Review from '../../Components/Review/Review.js';
import { useLocation, useNavigate } from 'react-router-dom';
import SingleReview from '../../Components/Review/SingleReview.js';

export default function ManagerHome() {
    const location = useLocation();
    const { state: user } = location;
    const navigate = useNavigate();
    const [show, setshow] = useState(false);
    const [showall, setshowall] = useState(false);
    const [showalldata, setshowalldata] = useState([]);
    const [showdata, setshowdata] = useState([]);
    const [showreview, setshowreview] = useState(false);
    const [reviewdata, setreviewdata] = useState([]);
    const [singlereviewdata, setsinglereviewdata] = useState();
    const [showsinglereview, setshowsinglereview] = useState(false);

    useEffect(() => {
        if (!user) {
            alert("You need to login first");
            navigate("/");
            return;
        }
        fetchReviewData();
    }, [user, navigate]);

    const getshowalldata = async () => {
        setshowall(true);
        try {
            const form = new FormData();
            form.append("empId", user.empid);
            const res = await fetch('http://localhost:8000/getselfimbursementsall', {
                method: "POST",
                body: form,
            });
            const data = await res.json();
            setshowalldata(data);
        } catch (error) {
            console.error("Error fetching all data:", error);
        }
    };

    const getUnapproved = async () => {
        setshowreview(true);
        try {
            const form = new FormData();
            form.append("empId", user.empid);
            const res = await fetch('http://localhost:8000/getselfimbursementsunapproved', {
                method: 'POST',
                body: form,
            });
            const data = await res.json();
            setshowdata(data);
        } catch (error) {
            console.error("Error fetching unapproved data:", error);
        }
    };

    const fetchReviewData = async () => {
        try {
            const form = new FormData();
            form.append("empid", user.empid);
            const res = await fetch('http://localhost:8000/toreview', {
                method: "POST",
                body: form,
            });
            const data = await res.json();
            console.log('Fetched review data:', data);
            setreviewdata(data);
        } catch (error) {
            console.error("Error fetching review data:", error);
        }
    };

    const handlesinglereviewchange = (review) => {
        setsinglereviewdata(review);
        console.log(review);
        setshowsinglereview(true);
    };

    return (
        <div>
            {user && <Header name={user.username} />}
            <div className='Scroll-component'>
                <div className='Scroll-Body-component'>
                    <div className='buttons-container'>
                        <button className="action-button" onClick={() => setshow(!show)}>
                            <span className="button__text">Claim new</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                        <button className="action-button" onClick={() => getshowalldata()}>
                            <span className="button__text">See All</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                        <button className="action-button" onClick={() => getUnapproved()}>
                            <span className="button__text">Show recent claims</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                    </div>
                   
                    <div className='Review-component'>
                        <Review reviewdata={reviewdata} user={user} handlesinglereviewchange={handlesinglereviewchange} />
                    </div>
                    {showsinglereview && <SingleReview singlereviewdata={singlereviewdata} showsinglereview={showsinglereview} setshowsinglereview={setshowsinglereview} user={user} refreshReviewData={fetchReviewData} />}
                    {show && <Claimnew setshow={setshow} show={show} user={user} />}
                    {showall && <SeeAll setshowall={setshowall} showall={showall} showalldata={showalldata} />}
                    {showreview && <Claimtable showdata={showdata} showreview={showreview} setshowreview={setshowreview} handlesinglereviewchange={handlesinglereviewchange} singlereviewdata={singlereviewdata} showsinglereview={showsinglereview} setshowsinglereview={setshowsinglereview} backbuttondisabled={false} />}
                </div>
            </div>
        </div>
    );
}
