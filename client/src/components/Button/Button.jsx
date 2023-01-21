import "./Button.css";

export const Button = (props) => {
    return (
        <button {...props} className = {'button ' + props.className} />
    );
}