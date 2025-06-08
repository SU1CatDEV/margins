import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function Select(
    { className = '', isFocused = false, children, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            className={
                'rounded-lg border-gray-300 border-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 scrollbar ' +
                className
            }
            ref={localRef}
        >
            {children}  
        </select>
    );
});
