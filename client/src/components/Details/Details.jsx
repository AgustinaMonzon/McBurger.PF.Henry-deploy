import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { Button, Box, Text } from "@chakra-ui/react";
import { getProductID, addToCart, removeFromCart, addProductFavorite, } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import "./Details.css";
import CreateComment from "../CreateComment/CreateComment";
import { useState } from 'react';
import swal from "sweetalert";

function Details() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.productsFavorites);
  /*   let activeAddToCar = "disabled"; */

  useEffect(() => {
    dispatch(getProductID(id));
    getFavorites();
  }, [id, dispatch]);

  const [product, cart, user] = useSelector((state) => [
    state.product,
    state.cart,
    state.user,
  ]);

  const [state, setState] = useState('');

  const getFavorites = () => {
    let item = window.localStorage.getItem('userL');
    let a;
    if (item) {
      a = JSON.parse(item);
    } else {
      a = { email: '' };
    }
    if (a.email) {
      setState('')
    } else {
      setState('disable')
    }
  }

  return (
    <div>
      <NavBar />
      {product[0] ?
        <div className="detailContainer">
          <div className="innerDetailContainer">
            <div className="detailImgContainer">
              <img
                className="detailImg"
                src={product[0]?.image}
                alt={product[0]?.name}
              />
            </div>
            <div className="detailTextContainer">
              <h2 className="detailTitle">{product[0]?.name}</h2>

              <div className="detailLabelContainerPrice">
                <p className="detailLabelPrice">Price:</p>
                <p className="detailPrice">{product[0]?.price}</p>
              </div>

              <div className="detailLabelContainer">
                <p className="detailLabel">Details:</p>
                <p>{product[0]?.summary}</p>
              </div>

              <div className="detailLabelContainer">
                <p className="detailLabel">Ingredients:</p>
                <p>{product[0]?.ingredients}</p>
              </div>
            </div>
            <div>
              <Button mt={'30px'} mb={'30px'} colorScheme='yellow'
                onClick={() => {
                  addProductFavorite({ product: product[0], userId: user.email })(
                    dispatch
                  )
                  /* alert('Product agregado') */
                  swal("Product added!!", {
                    buttons: false,
                    timer: 800,
                  })
                }
                }
              >
                {favorites.includes(product[0])
                  ? <div >🧡</div>
                  : <div>🤍</div>}
              </Button>
            </div>
            {!cart.hasOwnProperty(product[0].id) ? (
              <Button
                size="lg"
                colorScheme="green"
                marginTop="30px"
                disabled={state}
                onClick={() => dispatch(addToCart(product[0]))}
              >
                Add to cart
              </Button>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Button
                  marginRight="20px"
                  onClick={() => dispatch(removeFromCart(product[0]))}
                >
                  -
                </Button>
                <Text as="b" fontSize="3xl">
                  {cart[product[0].id].quantity}
                </Text>
                <Button
                  marginLeft="20px"
                  onClick={() => dispatch(addToCart(product[0]))}
                >
                  +
                </Button>
              </Box>
            )}
          </div>

        </div>
        : (
          <div className="detailContainer">
            <div className="innerDetailContainer">
              {/*  <h1 className="unknownProduct">
                404 Opps, it seems we don't have that product
              </h1> */}
            </div>
          </div>
        )}
      <div>
        <CreateComment />
        <Footer />
      </div>
    </div>
  );
}

export default Details;