import { FocusEventHandler, MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";

const useFocusHandle = <ContainerElement extends HTMLElement, BlurEscapeElement extends HTMLElement>() => {
    const [lastInteractedElement, setLastInteractedElement] = useState<HTMLElement | null>(null);

    const updateLastInteractedElement = useCallback((event: MouseEvent) => {
        if (event.target instanceof HTMLElement) {
            setLastInteractedElement(event.target);
        }
    }, []);
    
    useEffect(() => {
        document.addEventListener('mousedown', updateLastInteractedElement);
        return () => document.removeEventListener('mousedown', updateLastInteractedElement);
    }, []);

    /**
     * 
     * @description update isFocused
     */
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const onFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const blurEscapeElementRef = useRef<BlurEscapeElement>(null);

    const onBlur: FocusEventHandler<HTMLElement> = useCallback((event) => {
        const relatedTarget = event.relatedTarget ?? lastInteractedElement;
        const isBlurEscaped = !!relatedTarget && blurEscapeElementRef.current?.contains(relatedTarget);
        if (!isBlurEscaped) setIsFocused(false);
    }, [blurEscapeElementRef.current, lastInteractedElement]);


    /**
     * 
     * @description handle the event of mousedown out of the component; cancel everything
     */
    const containerElementRef = useRef<ContainerElement>(null);

    const cancelFocusOnOut = useCallback((event: MouseEvent) => {
        if (event.target instanceof HTMLElement && containerElementRef.current?.contains(event.target) === false) {
            setIsFocused(false);
        }
    }, [containerElementRef.current]);

    useEffect(() => {
        document.addEventListener("mousedown", cancelFocusOnOut);
        return () => document.removeEventListener("mousedown", cancelFocusOnOut);
    }, []);

    return {
        isFocused,
        onFocus,
        onBlur,
        blurEscapeElementRef,
        containerElementRef,
    }
}

export default useFocusHandle;