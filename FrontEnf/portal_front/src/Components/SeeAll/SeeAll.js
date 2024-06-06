import React from 'react';
import './SeeAll.css';
import 'bootstrap/dist/css/bootstrap.css';

export default function SeeAll({ showall, setshowall, showalldata }) {
    const backshowall = () => {
        setshowall(!showall);
    };

    return (
        <div className='SeeAll-container'>
            <div className='see-all'>
                <span>See All claims</span>
                <div className='Backshow'>
                    <button className="action-button" onClick={backshowall}>
                        <span className="button__text">Back</span>
                        <i className="button__icon fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            
            <div className='Screen-container'>
                <div className='seealltable-responsive'>
                    <table className='table table-fixed table-bordered table-hover'>
                        <thead>
                            <tr className='table-success'>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody className='tbody'>
                            {Array.isArray(showalldata) && showalldata.length > 0 ? (
                                showalldata.map((student, index) => (
                                    <tr key={index}>
                                        <td>{student.type}</td>
                                        <td>{student.amt}</td>
                                        <td>{student.date}</td>
                                        <td>{student.status}</td>
                                        <td>{student.comments}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>
    );
}
