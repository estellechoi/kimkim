import { ButtonHTMLAttributes } from "react";
import Icon, { IconType } from "../Icon";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    iconType: IconType;
    iconClassName?: string;
};

const IconButton = ({ iconType, iconClassName = '', ...args }: IconButtonProps) => {
    return (
      <button 
        type="button" 
        className="Transition_500 transition-opacity hover:opacity-80"
        {...args}
      >
        <Icon type={iconType} className={iconClassName} />
      </button>
    );
}

export default IconButton;