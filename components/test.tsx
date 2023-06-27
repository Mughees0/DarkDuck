"use client";

import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default class NextJsCarousel extends Component {
  render() {
    function onClickItem(): void {
      throw new Error("Function not implemented.");
    }

    function onClickThumb(): void {
      throw new Error("Function not implemented.");
    }
    function onChange(): void {
      throw new Error("Function not implemented.");
    }

    return (
      <div className="h-[500px] w-[500px]">
        <h2>NextJs Carousel - GeeksforGeeks</h2>
        <Carousel
          showArrows={true}
          onChange={onChange}
          onClickItem={onClickItem}
          onClickThumb={onClickThumb}
        >
          <div>
            <img src="assets/banner.jpg" />
            <p className="legend">Legend 1</p>
          </div>
          <div>
            <img src="assets/2.jpeg" />
            <p className="legend">Legend 2</p>
          </div>
          <div>
            <img src="assets/3.jpeg" />
            <p className="legend">Legend 3</p>
          </div>
          <div>
            <img src="assets/4.jpeg" />
            <p className="legend">Legend 4</p>
          </div>
          <div>
            <img src="assets/5.jpeg" />
            <p className="legend">Legend 5</p>
          </div>
          <div>
            <img src="assets/6.jpeg" />
            <p className="legend">Legend 6</p>
          </div>
        </Carousel>
      </div>
    );
  }
}
