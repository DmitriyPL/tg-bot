import { useCallback } from "react";
import { useState, useEffect } from "react";
import { useTelegram } from "../../hooks/useTelegram";

import "./Form.css";

export const Form = () => {
    
    const [town, setTown] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setsubject] = useState('physical');
    const { tg } = useTelegram();

    const onSendData = useCallback( ()=> {
        const data = {
            town,
            street,
            subject,
        }
        tg.sendData(JSON.stringify(data));
    }, [town, street, subject]);

    useEffect( () => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        }
    } , [onSendData])

    useEffect(() => {
        tg.MainButton.setParams(
            {
                text: 'Отправить данные'
            }
        )
    }, []);
 
    useEffect(() => {
        if(!street || !town) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [street, town]);

    const onChangeTown = (e) => {
        setTown(e.target.value);
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value);
    }

    const onChangeSubject = (e) => {
        setsubject(e.target.value);
    }

    return (
        <div className={'form'} >
            <h3>Введите ваши данные</h3>
            
            <input 
                className={"input"}
                type="text"
                placeholder={'Город'}
                value={town}
                onChange={onChangeTown}
            />

            <input 
                className={"input"}
                type="text" 
                placeholder={'Улица'} 
                value={street}
                onChange={onChangeStreet}            
            />

            <select 
                className={"select"}
                value={subject}
                onChange={onChangeSubject}
            >
 
                <option value={'physical'}>Физ. лицо</option>
                <option value={'legal'}>Юр. лицо</option>
 
            </select>
        </div>
    )
}