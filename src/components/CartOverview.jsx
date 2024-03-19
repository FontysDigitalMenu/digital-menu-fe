import React, { useState, useEffect } from 'react';

function CartOverview() {
  return(
    <>
      <div className="container">
        <div className="inner-container m-6 max-w-sm w-full max-h-sm mx-auto flex flex-col items-start">
          <div className="title-box text-2xl font-bold w-full">
            <p className="text-left">Your Order</p>
          </div>
          <div className="product-card m-6 w-full h-24 mx-auto bg-stone-200 rounded-xl flex mt-5">
            <div className="image-box h-full w-3/12 flex items-center justify-center">
              <div className=" size-5/6 bg-white rounded-xl">

              </div>
            </div>
            <div className="product-box w-6/12 px-2 h-full flex items-center">
              <div className="inner-box size-5/6">
                <div className="name-box first-letter:capitalize h-1/2 font-semibold text-xl"> 
                  cola
                </div>
                <div className="price-box h-1/2  flex items-end text-xl"> 
                  <div>
                    €3,00
                  </div>
                </div>
              </div>
            </div>
            <div className="amount-box h-full w-3/12">
              <div className="size-full flex items-center justify-center p-2">
                <div className="count-box rounded-md overflow-hidden bg-white h-6 w-full flex text-lg">
                  <button className="w-1/3 h-full bg-stone-400 font-bold flex items-center justify-center">
                    -
                  </button>
                  <div className="w-1/3 font-bold flex items-center justify-center">
                    <div> 
                      1
                    </div>
                  </div>
                  <button className="w-1/3 h-full bg-stone-400 font-bold flex items-center justify-center">
                    <div>
                      +
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-box h-24 w-full absolute bottom-3 left-0">
            <div className="total-box h-1/2 flex items-center justify-center text-2xl font-bold">
              Your Total: €3,00
            </div>
            <div className="checkout-btn text-2xl w-full h-1/2 flex items-center justify-center">
              <button className="flex items-center h-full text-white rounded-2xl italic mb-3 justify-center w-9/12 bg-red-600">
                Checkout Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartOverview