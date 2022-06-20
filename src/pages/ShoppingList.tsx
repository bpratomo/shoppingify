import React from "react";
import PropTypes from "prop-types";
import icon from "../assets/source.svg";
import "./ShoppingList.css";

function ShoppingList({}) {
  return (
    <div className="ShoppingList-base">
      <div className="ShoppingList-container">
        <section className="ShoppingList-hero">
          <div className="ShoppingList-hero-icon-container">
            <img src={icon} className="ShoppingList-hero-icon" />
          </div>
          <div className="ShoppingList-hero-text-container">
            <div className="ShoppingList-hero-text">
              Didn't find what you need?
            </div>
            <button className="ShoppingList-hero-add-button">Add Item</button>
          </div>
        </section>

        <section className="ShoppingList-title">
          <div className="ShoppingList-title-text">Shopping list</div>
          <div className="ShoppingList-title-edit">
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </div>
        </section>
        <section className="ShoppingList-category-container">
          <div className="ShoppingList-category-title">
            Fruit and vegetables
          </div>
          <div className="ShoppingList-item">
            <div className="ShoppingList-item-text">Avocado</div>
            <div className="ShoppingList-item-quantity">3pcs</div>
          </div>

          <div className="ShoppingList-item">
            <div className="ShoppingList-item-text">Pre-cooked corn</div>
            <div className="ShoppingList-item-quantity ">
              <button className="delete">
                <i className="fa fa-solid fa-trash" aria-hidden="true"></i>
              </button>
              <div className="ShoppingList-item-quantity-adjustment">
                <button className="add">
                  <i className="fa fa-solid fa-plus"></i>
                </button>
                <div className="counter-container">
                  <div className="ShoppingList-item-quantity-counter">3pcs</div>
                </div>{" "}
                <button className="substract">
                  <i className="fa fa-solid fa-minus" aria-hidden="true"></i>
                </button>
              </div>{" "}
            </div>
          </div>
        </section>

        <section className="ShoppingList-category-container">
          <div className="ShoppingList-category-title">Meat and Fish</div>
          <div className="ShoppingList-item">
            <div className="ShoppingList-item-text">Chicken 1 kg</div>
            <div className="ShoppingList-item-quantity edit">
              <button className="delete">
                <i className="fa fa-solid fa-trash" aria-hidden="true"></i>
              </button>
              <div className="ShoppingList-item-quantity-adjustment">
                <button className="add">
                  <i className="fa fa-solid fa-plus"></i>
                </button>
                <div className="counter-container">
                  <div className="ShoppingList-item-quantity-counter">3pcs</div>
                </div>{" "}
                <button className="substract">
                  <i className="fa fa-solid fa-minus" aria-hidden="true"></i>
                </button>
              </div>{" "}
            </div>
          </div>

          <div className="ShoppingList-item">
            <div className="ShoppingList-item-text">Pork fillets </div>
            <div className="ShoppingList-item-quantity">3pcs</div>
          </div>
        </section>
      </div>
      <section id="ShoppingList-input-box-container" className="hide">
        <div className="ShoppingList-input-box">
          {" "}
          <input
            type="text"
            className="ShoppingList-input-box-form"
            placeholder="Enter a name"
          />
          <button className="ShoppingList-input-button">Save</button>
        </div>{" "}
      </section>
      <section id="ShoppingList-input-box-container" className="">
        <button className="ShoppingList-finish-cancel">Cancel</button>
        <button className="ShoppingList-finish-complete">Complete</button>
      </section>
    </div>
  );
}

ShoppingList.defaultProps = {};

ShoppingList.propTypes = {};

export default ShoppingList;
