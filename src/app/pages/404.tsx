import React, { FC } from 'react';
import  '../../assets/sass/style.scss';
const Page404: FC = () => {

  return(
      <section className="error">
        <div className="container pt-100">
          <div className="row mt-45">
            <div className="col-md-12 pb-15">
              <h1 className="title-font-bold title-color" style={{fontFamily: 'Montserrat Bold' }}>OOPS, THIS IS AWKWARD! </h1>
            </div>
            <div className="col-md-11">
              <h1 className="title-font-bold text-color text-uppercase " style={{fontFamily: 'Montserrat Bold' }}>You are looking for something
                that doesn't really exist </h1>
            </div>
          </div>
          <div className="row pt-45">
            <div className="col-md-6">
              <div className="btn btn-primary">
                <a href="https://eeme.io" className="text-uppercase" style={{fontFamily: 'Montserrat Bold' }}>Don't panic, visit our homepage</a>
              </div>
            </div>
          </div>
          <div className="row justify-content-end pt-100 pb-50">
            <div className="col-md-9">
              <div className="image-omneeyat-container">
                <img className="w-100" src="/assets/images/eeme.png" alt={'404'}/>
              </div>
            </div>

          </div>


        </div>
      </section>
  );
}

export default Page404;