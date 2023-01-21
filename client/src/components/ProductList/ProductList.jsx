import { useState, useEffect, useCallback } from "react";

import "./ProductList.css";
import { useTelegram } from "../../hooks/useTelegram";
import { ProductItem } from "../ProductItem/ProductItem";


const products = [
    {id: '1', title: 'Джинсы',  price: 5000,  description: 'Синего цвета, прямые'},
    {id: '2', title: 'Куртка',  price: 15000, description: 'Зеленого цвета'},
    {id: '3', title: 'Брюки',   price: 4000,  description: 'Очень крутые'},
    {id: '4', title: 'Рубашка', price: 6000,  description: 'Распродажа'},
    {id: '5', title: 'Носки',   price: 81000, description: 'Остатки'},
    {id: '6', title: 'Сумка',   price: 500,   description: 'Кто не купит тот профан'},
    {id: '7', title: 'Ботинки', price: 33000, description: 'Надо брать'},
    {id: '8', title: 'Юбка',    price: 400,   description: 'Мамма мия!'},
]

const getTotalPrice = (items = []) => {
    return items.reduce( (acc, item) => {
        return acc += item.price;
    }, 0)
}

export const ProductList = () => {

    const [addedItems, setAddedItems] = useState([]);    
    const { tg, queryId } = useTelegram();

    const onSendData = useCallback( ()=> {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        
        fetch('http://localhost:8000', {
            method: 'POST',
            headers: {
                'Content-Type': 'aplication/json'
            },
            body: JSON.stringify(data),
        })    

    }, [addedItems]);

    useEffect( () => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        }
    } , [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find( item => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems);

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams(
                {
                    text: `Купить ${getTotalPrice(newItems)} руб.` 
                }
            )
        }
    }

    return (
        <div className={'list'}>
            {products.map( item => (
                <ProductItem 
                    key={item.id}
                    product={item}
                    className={'item'}
                    onAdd={onAdd}
                />
            ))}
        </div>
    )
}