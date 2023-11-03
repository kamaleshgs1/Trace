import React from 'react';
import './NextPage.css';
import jsonData from './data.json'; 

const NextPage = ({ text }) => {
  const data = jsonData.data; 

  return (
    <div>
      <div>
        <table cellPadding="7px" cellSpacing="1px">
          <tr className="blue-table">
            <td>Action&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td>Product Identification Code / Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td>Parent Batch&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td>Batch Number&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td>Batch Size (Weight)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td>Manufacture Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td>Expiry Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td>Status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
          </tr>
          {data.map((item, index) => (
            <tr key={index} className="lblue">
              <td>{item.action}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>{item.productName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>{item.parentBatch}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>{item.batchNumber}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>{item.batchSize}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>{item.manufactureDate}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>{item.expiryDate}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td className='act'>{item.status}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default NextPage;
