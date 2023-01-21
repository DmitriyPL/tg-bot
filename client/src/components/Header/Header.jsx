import "./Header.css";
import { Button } from "../Button/Button"
import { useTelegram } from "../../hooks/useTelegram.js";

export const Header = () => {

    const {onClose, user} = useTelegram();

    return (
        <div className={'header'}>
            <Button onClick={onClose} > Закрыть </Button>
            <span className={ 'username' }>
                { user }
            </span>
        </div>
    )
}